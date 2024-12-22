import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Response, ResponseSchema } from './responses.schema';
import { ResponseService } from './responses.services';
import { ResponseController } from './responses.controller';
import { QuizModule } from '../quizzes/quizzes.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
  MongooseModule.forFeature([{ name: Response.name, schema: ResponseSchema }]), QuizModule, UsersModule, ],
  providers: [ResponseService],
  controllers: [ResponseController],
})
export class ResponseModule {}
