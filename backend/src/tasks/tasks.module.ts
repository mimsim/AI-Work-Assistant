import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({})
export class TasksModule {
    constructor(private prisma: PrismaService) { }

    create(userId: string, title: string) {
        return this.prisma.task.create({
            data: { userId, title },
        });
    }

    findAll(userId: string) {
        return this.prisma.task.findMany({
            where: { userId },
        });
    }
}
