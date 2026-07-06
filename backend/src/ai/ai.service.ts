import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiService {
  private client: Anthropic;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    this.client = new Anthropic({
      apiKey: this.config.get('ANTHROPIC_API_KEY'),
    });
  }

  // ==========================================
  // 1️⃣ ТУК са методите, които реално пипат базата
  //    (summary, nextAction, prioritize вече ги имаш
  //     + createTask, markDone са новите от точка 1)
  // ==========================================
  async summary(userId: string) {
    const tasks = await this.prisma.task.findMany({ where: { userId } });
    return {
      total: tasks.length,
      done: tasks.filter(t => t.status === 'DONE').length,
      todo: tasks.filter(t => t.status !== 'DONE').length,
    };
  }

  async nextAction(userId: string) {
    const tasks = await this.prisma.task.findMany({
      where: { userId, status: 'TODO' },
    });
    const next = tasks.sort((a, b) => (b.priority ?? 3) - (a.priority ?? 3))[0];
    return { suggestion: next ? `Start with: ${next.title}` : 'No tasks found' };
  }

  async prioritize(userId: string) {
    const tasks = await this.prisma.task.findMany({ where: { userId } });
    return tasks.sort((a, b) => {
      const scoreA = (a.priority ?? 3) + (a.status === 'TODO' ? 2 : 0);
      const scoreB = (b.priority ?? 3) + (b.status === 'TODO' ? 2 : 0);
      return scoreB - scoreA;
    });
  }

  async createTask(userId: string, data: { title: string; description?: string; priority?: number }) {
    return this.prisma.task.create({
      data: {
        userId,
        title: data.title,
        description: data.description ?? '',
        priority: data.priority ?? 3,
        status: 'TODO',
      },
    });
  }

  async markDone(userId: string, taskTitle: string) {
    const task = await this.prisma.task.findFirst({
      where: { userId, title: { contains: taskTitle, mode: 'insensitive' } },
    });
    if (!task) return { error: `Task "${taskTitle}" not found` };

    return this.prisma.task.update({
      where: { id: task.id },
      data: { status: 'DONE' },
    });
  }

  // ==========================================
  // 2️⃣ ТУК е списъкът с "инструменти", които казваме
  //    на Claude, че съществуват. Това е "менюто",
  //    от което Claude избира какво да извика.
  //    Това е property (поле) на класа, не метод.
  // ==========================================
  private tools: Anthropic.Tool[] = [
    {
      name: 'get_summary',
      description: 'Връща обобщение колко задачи има потребителят, колко са done и колко pending',
      input_schema: { type: 'object', properties: {} },
    },
    {
      name: 'get_next_action',
      description: 'Връща следващата задача с най-висок приоритет, с която потребителят трябва да започне',
      input_schema: { type: 'object', properties: {} },
    },
    {
      name: 'get_prioritized_list',
      description: 'Връща всички задачи на потребителя, подредени по приоритет',
      input_schema: { type: 'object', properties: {} },
    },
    {
      name: 'create_task',
      description: 'Създава нова задача за потребителя',
      input_schema: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'Заглавие на задачата' },
          description: { type: 'string', description: 'Описание (опционално)' },
          priority: { type: 'number', description: 'Приоритет 1-5, по-високо число = по-важно' },
        },
        required: ['title'],
      },
    },
    {
      name: 'mark_task_done',
      description: 'Маркира дадена задача като завършена по нейното заглавие (или част от него)',
      input_schema: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'Заглавие или част от заглавието на задачата' },
        },
        required: ['title'],
      },
    },
    {
      name: 'update_task',
      description: 'Обновява съществуваща задача - може да смени заглавие, описание, приоритет или статус. Намира задачата по (частично) заглавие.',
      input_schema: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'Текущо заглавие (или част от него) на задачата, която да намерим' },
          newTitle: { type: 'string', description: 'Ново заглавие (опционално)' },
          description: { type: 'string', description: 'Ново описание (опционално)' },
          priority: { type: 'number', description: 'Нов приоритет 1-5 (опционално)' },
          status: { type: 'string', description: 'Нов статус: TODO или DONE (опционално)' },
        },
        required: ['title'],
      },
    },
    {
      name: 'delete_task',
      description: 'Изтрива задача по (частично) заглавие',
      input_schema: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'Заглавие или част от заглавието на задачата за изтриване' },
        },
        required: ['title'],
      },
    },
  ];

  // ==========================================
  // 3️⃣ ТУК е "рутерът" — когато Claude каже
  //    "искам да извикам get_summary" или "create_task",
  //    тази функция решава кой реален метод отгоре (1️⃣) да викне.
  //    Забележи: приема и `input` — аргументите, които Claude подава
  //    (напр. title, description, priority за create_task).
  // ==========================================
  private async runTool(name: string, userId: string, input: any) {
    switch (name) {
      case 'get_summary':
        return this.summary(userId);
      case 'get_next_action':
        return this.nextAction(userId);
      case 'get_prioritized_list':
        return this.prioritize(userId);
      case 'create_task':
        return this.createTask(userId, input);
      case 'mark_task_done':
        return this.markDone(userId, input.title);
      case 'update_task':
        return this.updateTask(userId, input);
      case 'delete_task':
        return this.deleteTask(userId, input.title);
      default:
        return { error: 'Unknown tool' };
    }
  }

  // ==========================================
  // 4️⃣ ТУК е главната chat() функция — тя:
  //    - изпраща съобщението + tools + system prompt към Claude
  //    - ако Claude поиска tool_use, вика runTool() (3️⃣)
  //    - връща резултата обратно на Claude за финален отговор
  //    system promptа (обяснено в предишния ми отговор, точка 4)
  //    е просто текстовият стринг вътре в messages.create()
  // ==========================================
  async chat(userId: string, message: string) {
    // 1️⃣ Зареждаме историята
    const history = await this.prisma.message.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      take: 20,
    });

    const messages: Anthropic.MessageParam[] = [
      ...history.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user', content: message },
    ];

    let response = await this.client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system:
        'Ти си AI асистент за управление на задачи (todo/task manager). ' +
        'Използвай наличните инструменти за четене, създаване, обновяване и изтриване на задачи. ' +
        'Помни контекста от предишни съобщения в разговора. ' +
        'Отговаряй кратко, на езика на потребителя.',
      tools: this.tools,
      messages,
    });

    while (response.stop_reason === 'tool_use') {
      const toolUseBlocks = response.content.filter(
        (b): b is Anthropic.ToolUseBlock => b.type === 'tool_use',
      );

      messages.push({ role: 'assistant', content: response.content });

      const toolResults: Anthropic.ToolResultBlockParam[] = [];
      for (const block of toolUseBlocks) {
        const result = await this.runTool(block.name, userId, block.input);
        toolResults.push({
          type: 'tool_result',
          tool_use_id: block.id,
          content: JSON.stringify(result),
        });
      }

      messages.push({ role: 'user', content: toolResults });

      response = await this.client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        tools: this.tools,
        messages,
      });
    }

    const textBlock = response.content.find(
      (b): b is Anthropic.TextBlock => b.type === 'text',
    );
    const reply = textBlock?.text ?? '';

    // 2️⃣ Записваме диалога в базата
    await this.prisma.message.createMany({
      data: [
        { userId, role: 'user', content: message },
        { userId, role: 'assistant', content: reply },
      ],
    });

    return { reply };
  }
  async updateTask(
    userId: string,
    data: { title: string; newTitle?: string; description?: string; priority?: number; status?: string },
  ) {
    const task = await this.prisma.task.findFirst({
      where: { userId, title: { contains: data.title, mode: 'insensitive' } },
    });
    if (!task) return { error: `Task "${data.title}" not found` };

    const validStatuses = ['TODO', 'IN_PROGRESS', 'DONE'];
    if (data.status && !validStatuses.includes(data.status)) {
      return { error: `Invalid status "${data.status}". Must be one of: ${validStatuses.join(', ')}` };
    }

    return this.prisma.task.update({
      where: { id: task.id },
      data: {
        ...(data.newTitle && { title: data.newTitle }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.priority !== undefined && { priority: data.priority }),
        ...(data.status !== undefined && { status: data.status as any }),
      },
    });
  }

  async deleteTask(userId: string, title: string) {
    const task = await this.prisma.task.findFirst({
      where: { userId, title: { contains: title, mode: 'insensitive' } },
    });
    if (!task) return { error: `Task "${title}" not found` };

    await this.prisma.task.delete({ where: { id: task.id } });
    return { success: true, deleted: task.title };
  }
}