import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoursesModule } from './courses/courses.module';
import { UsersModule } from './users/users.module';
import { QuizModule } from './quizzes/quizzes.module';
import { QuestionsModule } from './questions/questions.module'
import { ProgressModule } from './progress/progress.module';
import { ResponseModule } from './responses/responses.module';
import { ModulesModule } from './modules/modules.module';
import { NotesModule } from './notes/notes.module';
import { AuthModule } from './auth/auth.module';
import { BackupModule } from './backup/backup.module';
//import { ChatModule } from './chat/chat.module';


@Module({                         //copy below in mongodb compass should connect you with database if not tell koshty :)
  imports: [MongooseModule.forRoot('mongodb+srv://koshty:Pm07DIXleojhZaqD@e-learning.k67sj.mongodb.net/e-learning'), CoursesModule,UsersModule,QuizModule,QuestionsModule,ProgressModule,ResponseModule,ModulesModule,NotesModule,AuthModule, BackupModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
