import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '../core/prisma/prisma.service';


@Injectable()
export class TaskService {
    constructor(private prisma: PrismaService) { }

    findAll(userId: string) {
        return this.prisma.task.findMany({
            where: { userId },
            include: { user: true },
        });
    }

    findOne(id: string) {
        return this.prisma.task.findUnique({
            where: { id },
        });
    }

    create(dto: CreateTaskDto & { userId: string }) {
        const { userId, ...rest } = dto;
        return this.prisma.task.create({
            data: {
                ...rest,
                userId,
            },
        });
    }

    update(id: string, dto: UpdateTaskDto) {
        return this.prisma.task.update({
            where: { id },
            data: dto,
        });
    }

    remove(id: string) {
        return this.prisma.task.delete({
            where: { id },
        });
    }
}