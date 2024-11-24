import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notes, NoteDocument } from './notes.schema'; // Ensure correct import

@Injectable()
export class NoteService {
  constructor(
    @InjectModel(Notes.name) private readonly noteModel: Model<NoteDocument>,
  ) {}

  // Create a new Note
  async createNote(noteData: Partial<Notes>): Promise<Notes> {
    const newNote = new this.noteModel(noteData);
    return newNote.save();
  }

  // Get all the Notes
  async getNotes(): Promise<Notes[]> {
    return this.noteModel.find().exec();
  }

  // Get one Note by its ID
  async getNoteById(noteId: string): Promise<Notes> {
    const note = await this.noteModel.findById(noteId).exec();
    if (!note) {
      throw new NotFoundException(`Note with ID ${noteId} not found`);
    }
    return note;
  }

  // Update a Note by its ID
  async updateNote(noteId: string, updateData: Partial<Notes>): Promise<Notes> {
    const note = await this.noteModel.findByIdAndUpdate(noteId, updateData, { new: true }).exec();
    if (!note) {
      throw new NotFoundException(`Note with ID ${noteId} not found`);
    }
    return note;
  }

  // Delete a Note by its ID
  async deleteNote(noteId: string): Promise<void> {
    const result = await this.noteModel.deleteOne({ _id: noteId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Note with ID ${noteId} not found`);
    }
  }
}
