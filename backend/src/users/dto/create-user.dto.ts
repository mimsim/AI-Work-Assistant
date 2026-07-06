import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ example: 'test@test.com' })
    email!: string;

    @ApiProperty({ example: '123456' })
    password!: string;
}