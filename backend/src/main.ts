import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
<<<<<<< Updated upstream

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
=======
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config(); 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for WebSocket and HTTP
  app.enableCors({
    origin: `http://localhost:3000`, // Frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'], // Add headers if needed
  });
  
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3001); // Make sure backend runs on port 3001
>>>>>>> Stashed changes
}

bootstrap();
