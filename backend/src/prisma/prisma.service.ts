import { Injectable, OnModuleInit } from '@nestjs/common';
import * as Prisma from '@prisma/client';

const { PrismaClient } = Prisma as any;

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    async onModuleInit() {
        await this.$connect();
    }
}