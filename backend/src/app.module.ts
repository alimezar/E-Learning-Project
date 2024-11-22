import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoursesModule } from './courses/courses.module';
import { UsersModule } from './users/users.module';

@Module({                         //copy below in mongodb compass should connect you with database if not tell koshty :)
  imports: [MongooseModule.forRoot('mongodb+srv://koshty:Pm07DIXleojhZaqD@e-learning.k67sj.mongodb.net/e-learning'), CoursesModule,UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
