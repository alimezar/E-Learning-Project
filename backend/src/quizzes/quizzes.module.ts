import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizSchema } from './quizzes.schema';
import { QuizService } from './quizzes.service';
import { QuizController } from './quizzes.controller';
import { ModulesModule } from '../modules/modules.module'; 
import { QuestionsModule } from '../questions/questions.module';
import { ProgressModule } from '../progress/progress.module';
import { UsersModule } from '../users/users.module';

@Module({
    imports:[MongooseModule.forFeature([{name: 'Quizzes',schema:QuizSchema}]), ModulesModule, QuestionsModule,
     ProgressModule, UsersModule],
    providers: [QuizService],
    controllers: [QuizController],
    exports: [QuizService, MongooseModule],
})
export class QuizModule {}