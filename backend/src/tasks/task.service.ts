import { Injectable } from '@nestjs/common';
import { CreateAiDto } from '../ai/dto/create-ai.dto';
import { UpdateAiDto } from '../ai/dto/update-ai.dto';
import { PrismaService } from '../prisma/prisma.service';


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

    create(dto: CreateAiDto) {
        return this.prisma.task.create({
            data: {
                ...dto,
                userId: 'demo-user',
            },
        });
    }

    update(id: string, dto: UpdateAiDto) {
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
