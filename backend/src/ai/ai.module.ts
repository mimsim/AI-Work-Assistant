import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';

import { TasksModule } from '../tasks/tasks.module';
import { PrismaModule } from '../core/prisma/prisma.module';

@Module({
  imports: [PrismaModule, TasksModule], 
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule { }