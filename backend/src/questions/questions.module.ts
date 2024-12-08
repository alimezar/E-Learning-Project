import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionSchema, Questions } from './questions.schema';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { ModulesModule } from '../modules/modules.module';


@Module({
    imports: [MongooseModule.forFeature([{ name: 'Questions', schema: QuestionSchema }]),ModulesModule],
    providers: [QuestionsService],
    controllers: [QuestionsController],
    exports: [QuestionsService, MongooseModule],
})
export class QuestionsModule {}
