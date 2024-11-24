import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NoteController } from './notes.controller';
import { NoteService } from './notes.service';
import { Notes, NoteSchema } from './notes.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Notes.name, schema: NoteSchema }])],
  controllers: [NoteController],
  providers: [NoteService],
})
export class NotesModule {}
