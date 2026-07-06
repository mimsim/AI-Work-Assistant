// export class CreateTaskDto {
//     title!: string;
//     description?: string;
//     status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
// }

import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateTaskDto {
    @ApiProperty({ example: 'Build backend API' })
    @IsString()
    title!: string;

    @ApiProperty({ example: 'Create NestJS + Prisma backend', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({
        example: 'TODO',
        required: false,
        enum: ['TODO', 'IN_PROGRESS', 'DONE'],
    })
    @IsOptional()
    @IsEnum(['TODO', 'IN_PROGRESS', 'DONE'])
    status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
}