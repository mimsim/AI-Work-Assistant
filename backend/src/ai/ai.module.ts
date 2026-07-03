import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';

@Module({
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {
  async generateTaskPlan(prompt: string) {
    return {
      result: `AI plan for: ${prompt}`,
    };
  }
}
