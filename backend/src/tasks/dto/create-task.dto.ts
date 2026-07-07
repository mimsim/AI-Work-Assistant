import { IsOptional, IsString, IsEnum } from 'class-validator';

export class CreateTaskDto {
    @IsString()
    title!: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsEnum(['TODO', 'IN_PROGRESS', 'DONE'])
    status?: 'TODO' | 'IN_PROGRESS' | 'DONE';

    @IsString()
    userId!: string; 
}