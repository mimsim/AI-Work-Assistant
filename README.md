# AI-Work-Assistant
Angular 22 + NestJS 11 + tool calling
# AI Work Assistant

Full-stack приложение за управление на задачи (task manager) с вграден AI асистент, задвижван от Claude. Асистентът не просто отговаря на въпроси - той реално чете, създава, обновява и изтрива задачи чрез tool use, и помни контекста на разговора.

## Технологичен стек

**Backend**
- NestJS
- Prisma ORM + PostgreSQL
- Anthropic SDK (Claude) с tool use
- class-validator за DTO валидация
- Swagger за API документация

**Frontend**
- Angular (standalone components, signals, Reactive Forms)
- Angular Material
- RxJS

## Как работи AI асистентът

Вместо rule-based (if/else по ключови думи) логика, асистентът използва реалния Claude модел с **tool use**:

1. Потребителят изпраща съобщение до `/api/ai/chat`
2. Claude получава списък с налични "инструменти" (`get_summary`, `get_next_action`, `create_task`, `update_task`, `delete_task` и др.)
3. Claude сам решава кой инструмент да извика според съдържанието на съобщението
4. `AiService` изпълнява реалната Prisma заявка (create/read/update/delete в базата)
5. Резултатът се връща обратно на Claude, който формулира финален, човешки отговор
6. Целият диалог (user + assistant съобщения) се записва в таблица `Message`, за да могат бъдещи заявки да имат контекст от предишния разговор

### Налични AI инструменти

| Tool | Описание |
|---|---|
| `get_summary` | Обобщение на общ брой, done и pending задачи |
| `get_next_action` | Задачата с най-висок приоритет за начало |
| `get_prioritized_list` | Всички задачи, подредени по приоритет |
| `create_task` | Създава нова задача |
| `update_task` | Обновява заглавие/описание/приоритет/статус |
| `delete_task` | Изтрива задача по заглавие |

## Data модел (Prisma)

- **User** - потребители (email, password, name)
- **Task** - задачи (title, description, status: `TODO`/`IN_PROGRESS`/`DONE`, priority, dueDate, category)
- **Message** - история на чат разговора (role: `user`/`assistant`, content), използва се за памет на контекста

## Стартиране на проекта

### Backend

```bash
cd backend
npm install

# .env файл в backend/ с:
# DATABASE_URL=postgresql://...
# ANTHROPIC_API_KEY=sk-ant-...

npx prisma migrate dev
npm run start:dev
```

Backend-ът стартира на `http://localhost:3000`. Swagger документация (ако е конфигурирана) е достъпна на `/api`.

### Frontend

```bash
cd frontend
npm install
ng serve
```

## Основни API endpoints

| Метод | Path | Описание |
|---|---|---|
| POST | `/api/ai/chat` | Изпраща съобщение до AI асистента |
| GET | `/api/tasks?userId=...` | Всички задачи на потребител |
| GET | `/api/tasks/:id` | Конкретна задача |
| POST | `/api/tasks` | Създава задача |
| PUT | `/api/tasks/:id` | Обновява задача |
| DELETE | `/api/tasks/:id` | Изтрива задача |

## Текущо състояние / известни ограничения

- Автентикацията все още не е свързана с frontend-а - използва се фиксиран `userId` за тестови цели
- Историята на разговора зарежда последните 20 съобщения без summarization на по-стари такива
- Няма streaming на AI отговорите - текстът се показва целия наведнъж след готовност
