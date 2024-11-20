import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Course, CourseSchema } from './schemas/course.schema';
import { Module as CourseModule, ModuleSchema } from './schemas/module.schema';
import { Quiz, QuizSchema } from './schemas/quiz.schema';
import { Response, ResponseSchema } from './schemas/response.schema';
import { Progress, ProgressSchema } from './schemas/progress.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/elearning'),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Course.name, schema: CourseSchema },
      { name: CourseModule.name, schema: ModuleSchema },
      { name: Quiz.name, schema: QuizSchema },
      { name: Response.name, schema: ResponseSchema },
      { name: Progress.name, schema: ProgressSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
