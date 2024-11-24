import { Controller, Post, Get, Body, Param, Put, Delete } from '@nestjs/common';
import { NoteService } from './notes.service';
import { Notes } from './notes.schema';

@Controller('notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  // Create a new note
  @Post()
  async createNote(@Body() noteData: Partial<Notes>): Promise<Notes> {
    return this.noteService.createNote(noteData);
  }

  // Get all the notes
  @Get()
  async getNotes(): Promise<Notes[]> {
    return this.noteService.getNotes();
  }

  // Get one note by its ID
  @Get(':id')
  async getNote(@Param('id') noteId: string): Promise<Notes> {
    return this.noteService.getNoteById(noteId);
  }

  // Update a note by its ID
  @Put(':id')
  async updateNote(
    @Param('id') noteId: string,
    @Body() updateData: Partial<Notes>,
  ): Promise<Notes> {
    return this.noteService.updateNote(noteId, updateData);
  }

  // Delete a note by its ID
  @Delete(':id')
  async deleteNote(@Param('id') noteId: string): Promise<void> {
    await this.noteService.deleteNote(noteId);
  }
}
