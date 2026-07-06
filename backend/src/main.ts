import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: '*',
  });

  const config = new DocumentBuilder()
    .setTitle('AI Work Assistant API')
    .setDescription('Tasks API for AI Work Assistant project')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app as any, config);
  SwaggerModule.setup('api/docs', app as any, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();