import { Controller, Post, Get, Body, Param, Put, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { NoteService } from './notes.service';
import { Notes } from './notes.schema';

@Controller('notes') // Base route
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

  // Get all notes
  @Get()
  async getNotes(): Promise<Notes[]> {
    return await this.noteService.getNotes();
  }

  // Get one note by its ID
  @Get(':id')
  async getNoteById(@Param('id') noteId: string): Promise<Notes> {
    try {
      return await this.noteService.getNoteById(noteId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
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
