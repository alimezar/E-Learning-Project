import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Response, ResponseSchema } from './responses.schema';
import { ResponseService } from './responses.services';
import { ResponseController } from './responses.controller';
import { QuizModule } from '../quizzes/quizzes.module';
import { UsersModule } from '../users/users.module';
import { ProgressModule } from '../progress/progress.module';
import { ModulesModule } from '../modules/modules.module'; 
import { QuestionsModule } from '../questions/questions.module';
import { CoursesModule } from '../courses/courses.module';


@Module({
  imports: [
  MongooseModule.forFeature([{ name: Response.name, schema: ResponseSchema }]), QuizModule, UsersModule, 
   ProgressModule, ModulesModule, QuestionsModule, CoursesModule],
  providers: [ResponseService],
  controllers: [ResponseController],
})
export class ResponseModule {}
