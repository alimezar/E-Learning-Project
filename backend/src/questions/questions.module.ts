import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionSchema, Questions } from './questions.schema';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { ModulesModule } from '../modules/modules.module';
import { UsersModule } from '../users/users.module';


@Module({
    imports: [MongooseModule.forFeature([{ name: 'Questions', schema: QuestionSchema }]),ModulesModule, UsersModule],
    providers: [QuestionsService],
    controllers: [QuestionsController],
    exports: [QuestionsService, MongooseModule],
})
export class QuestionsModule {}
