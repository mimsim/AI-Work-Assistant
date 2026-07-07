import { Module } from "@nestjs/common";

import { TaskService } from "./task.service";
import { TasksController } from "./tasks.controller";
import { PrismaModule } from "../core/prisma/prisma.module";

@Module({
    imports: [PrismaModule],
    controllers: [TasksController],
    providers: [TaskService],
})
export class TasksModule { 
  
}
