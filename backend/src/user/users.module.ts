import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from './users.service';
import { AiController } from 'src/ai/ai.controller';



@Module({
  providers: [UsersService],
  controllers: [AiController]
})
export class UsersModule {
    constructor(private prisma: PrismaService) { }

    create(email: string, password: string) {
        return this.prisma.user.create({
            data: { email, password },
        });
    }

    findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }
}
