import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizSchema } from './quizzes.schema';
import { QuizService } from './quizzes.service';
import { QuizController } from './quizzes.controller';
import { ModulesModule } from '../modules/modules.module'; 


@Module({
    imports:[MongooseModule.forFeature([{name: 'Quizzes',schema:QuizSchema}]), ModulesModule],
    providers: [QuizService],
    controllers: [QuizController],
    exports: [QuizService, MongooseModule],
})
export class QuizModule {}