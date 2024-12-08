import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { Notes, NotesSchema } from './notes.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Notes.name, schema: NotesSchema }]),
    UsersModule,  // Import UsersModule to access UserModel
  ],
  controllers: [NotesController],  // Ensure NotesController is registered here
  providers: [NotesService],
})
export class NotesModule {}
