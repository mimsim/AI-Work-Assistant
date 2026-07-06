// export class UpdateTaskDto {
//     title?: string;
//     description?: string;
//     status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
// }
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTaskDto {
    @ApiPropertyOptional({ example: 'Updated title' })
    title?: string;

    @ApiPropertyOptional({ example: 'Updated description' })
    description?: string;

    @ApiPropertyOptional({
        example: 'DONE',
        enum: ['TODO', 'IN_PROGRESS', 'DONE'],
    })
    status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
}