import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Put,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { NoteService } from './notes.service';
import { Notes } from './notes.schema';

@Controller('notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  // Create a new note
  @Post()
  async createNote(@Body() noteData: Partial<Notes>): Promise<Notes> {
    try {
      return await this.noteService.createNote(noteData);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Get notes by user and module
  @Get('user/:userId/module/:moduleId')
  async getNotesByUserAndModule(
    @Param('userId') userId: string,
    @Param('moduleId') moduleId: string,
  ): Promise<Notes[]> {
    return this.noteService.getNotesByUserAndModule(userId, moduleId);
  }

  // Get All notes 
  @Get()
  async getAllNotes(): Promise<Notes[]>{
    return this.noteService.getNotes();
  }
  // Update a note by its ID
  @Put(':id')
  async updateNote(
    @Param('id') noteId: string,
    @Body() updateData: Partial<Notes>,
  ): Promise<Notes> {
    try {
      return await this.noteService.updateNote(noteId, updateData);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  // Delete a note by its ID
  @Delete(':id')
  async deleteNoteById(@Param('id') noteId: string): Promise<void> {
    try {
      return await this.noteService.deleteNote(noteId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
