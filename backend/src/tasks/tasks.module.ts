import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { TaskService } from "./task.service";
import { TasksController } from "./tasks.controller";

@Module({
    imports: [PrismaModule],
    controllers: [TasksController],
    providers: [TaskService],
})
export class TasksModule { 
  
}
