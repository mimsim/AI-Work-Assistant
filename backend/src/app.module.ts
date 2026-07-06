import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AiModule } from './ai/ai.module';
import { ChatController } from './chat/chat/chat.controller';
import { ChatService } from './chat/chat/chat.service';
import { ToolsModule } from './tools/tools/tools.module';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AiModule,
    ToolsModule,
    AuthModule,
    TasksModule,
    PrismaModule,
    UsersModule
  ],
  controllers: [
    AppController,
    ChatController
  ],
  providers: [
    AppService,
    ChatService
  ],
})
export class AppModule { }
