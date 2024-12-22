import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';


dotenv.config(); 


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Use static assets for serving uploaded files
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  // Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL, // Frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'], // Add headers if needed
  });

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3001); // Make sure backend runs on port 3001
  

  
}
bootstrap();
