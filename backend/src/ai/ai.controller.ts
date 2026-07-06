import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) { }

  @Get('summary')
  summary(@Query('userId') userId: string) {
    return this.aiService.summary(userId);
  }

  @Get('next')
  next(@Query('userId') userId: string) {
    return this.aiService.nextAction(userId);
  }

  @Get('prioritize')
  prioritize(@Query('userId') userId: string) {
    return this.aiService.prioritize(userId);
  }
  @Post('chat')
  chat(@Body() body: { userId: string; message: string }) {
    return this.aiService.chat(body.userId, body.message);
  }
}