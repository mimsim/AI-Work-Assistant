import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    create(email: string, name?: string) {
        return this.prisma.user.create({
            data: { email, name },
        });
    }

    findAll() {
        return this.prisma.user.findMany({
            include: { tasks: true },
        });
    }

    findOne(id: string) {
        return this.prisma.user.findUnique({
            where: { id },
            include: { tasks: true },
        });
    }
    async seedUser() {
        return this.prisma.user.upsert({
            where: { email: 'demo@ai.app' },
            update: {},
            create: {
                email: 'demo@ai.app',
                password: 'demo123',
            },
        });
    }
}
