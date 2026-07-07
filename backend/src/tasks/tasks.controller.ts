import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TaskService) { }

    @Post()
    @ApiOperation({ summary: 'Create task' })
    create(@Body() dto: CreateTaskDto) {
        return this.tasksService.create(dto);
    }

    @ApiOperation({ summary: 'Get all tasks' })
    @Get()
    findAll(@Query('userId') userId: string) {
        return this.tasksService.findAll(userId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get task by id' })
    findOne(@Param('id') id: string) {
        return this.tasksService.findOne(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update task' })
    update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
        return this.tasksService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete task' })
    remove(@Param('id') id: string) {
        return this.tasksService.remove(id);
    }
}