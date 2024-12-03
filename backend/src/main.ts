import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config(); 


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: `*`, // Frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'], // Add headers if needed
  });

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3001); // Make sure backend runs on port 3001

  
}
bootstrap();
