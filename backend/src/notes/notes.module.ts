import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NoteController } from './notes.controller';
import { NoteService } from './notes.service';
import { Notes, NoteSchema } from './notes.schema';
import { UsersModule } from '../users/users.module';
import { CoursesModule } from '../courses/courses.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Notes.name, schema: NoteSchema }]), UsersModule, CoursesModule, ],
  controllers: [NoteController],
  providers: [NoteService],
})
export class NotesModule {}
