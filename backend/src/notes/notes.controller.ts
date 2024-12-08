import { Controller, Post, Get, Body, Param, Delete, NotFoundException } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNotesDto } from './dto/create-notes.dto';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  // POST: Create a new note
  @Post()
  async createNote(@Body() createNotesDto: CreateNotesDto) {
    console.log('Creating a new note with content:', createNotesDto.content);
    return this.notesService.create(createNotesDto);
  }

  // GET: Get all notes by user_id
  @Get(':user_id')
  async getUserNotes(@Param('user_id') user_id: string) {
    console.log('Fetching all notes for user:', user_id);
    return this.notesService.findAll(user_id);
  }

  // GET: Get a single note by ID
  @Get('note/:id')
  async getNoteById(@Param('id') id: string) {
    console.log('Fetching note with ID:', id);
    return this.notesService.findOne(id);
  }

  // DELETE: Delete a note by ID
  @Delete('note/:id')
  async deleteNoteById(@Param('id') id: string) {
    console.log('Deleting note with ID:', id);
    return this.notesService.remove(id);
  }
}
