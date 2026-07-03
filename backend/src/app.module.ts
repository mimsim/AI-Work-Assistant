import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AiModule } from './ai/ai.module';
import { ChatController } from './chat/chat/chat.controller';
import { ChatService } from './chat/chat/chat.service';
import { ToolsModule } from './tools/tools/tools.module';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './user/users.module';

@Module({
  imports: [AiModule, ToolsModule, AuthModule, TasksModule, PrismaModule, UsersModule, PrismaModule],
  controllers: [AppController, ChatController],
  providers: [AppService, ChatService, PrismaService],
})
export class AppModule {}
