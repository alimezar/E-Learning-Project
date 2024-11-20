import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://koshty:Pm07DIXleojhZaqD@e-learning.k67sj.mongodb.net/e-learning'), UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
