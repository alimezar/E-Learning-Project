import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizSchema } from './quizzes.schema';
import { QuizService } from './quizzes.service';
import { QuizController } from './quizzes.controller';

@Module({
    imports:[MongooseModule.forFeature([{name: 'Quizzes',schema:QuizSchema}])],
    providers: [QuizService],
    controllers: [QuizController]
})
export class QuizModule {}