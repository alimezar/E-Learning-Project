import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notes, NoteDocument } from './notes.schema';
import { Users } from '../users/users.schema';
import { Module } from '../modules/modules.schema';

@Injectable()
export class NoteService {
  constructor(
    @InjectModel(Notes.name) private readonly noteModel: Model<NoteDocument>,
    @InjectModel('Users') private readonly userModel: Model<Users>, 
    @InjectModel('Module') private readonly moduleModel: Model<Module>,
  ) {}

  private async validateUserId(userId: Types.ObjectId): Promise<void> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      console.error(`Invalid user_id: "${userId}"`);
      throw new BadRequestException(`Invalid user_id: "${userId}"`);
    }
  }


  private async validateModuleId(moduleId: Types.ObjectId): Promise<void> {
    const module = await this.moduleModel.findById(moduleId).exec();
    if (!module) {
      console.error(`Invalid module_id: "${moduleId}"`);
      throw new BadRequestException(`Invalid module_id: "${moduleId}"`);
    }
  }

  // Create a new Note
  async createNote(noteData: Partial<Notes>): Promise<Notes> {
    const { user_id, module_id } = noteData;

  // Check which required field is missing and throw a specific error
  if (!user_id) {
    throw new BadRequestException('user_id is required');
  }

  if (!module_id) {
    throw new BadRequestException('module_id is required');
  }
    const userObjectId = new Types.ObjectId(user_id);
    const moduleObjectId = new Types.ObjectId(module_id);

    await this.validateUserId(userObjectId);
    await this.validateModuleId(moduleObjectId);

    const newNote = new this.noteModel({
      ...noteData,
      user_id: userObjectId,
      module_id: moduleObjectId,
    });

    return newNote.save();
  }

  // Get all Notes
  async getNotes(): Promise<Notes[]> {
    return this.noteModel.find().exec();
  }

  // Get one Note by its ID
  async getNoteById(noteId: string): Promise<Notes> {
    const note = await this.noteModel
      .findById(noteId)
      .populate('user_id')
      .populate('module_id')
      .exec();
    if (!note) {
      throw new NotFoundException(`Note with ID ${noteId} not found`);
    }
    return note;
  }

// Get Notes by User and Module
async getNotesByUserAndModule(userId: string, moduleId: string): Promise<Notes[]> {
  // Convert userId and moduleId to ObjectId types
  const userObjectId = new Types.ObjectId(userId);
  const moduleObjectId = new Types.ObjectId(moduleId);

  const notes = await this.noteModel
    .find({ user_id: userObjectId, module_id: moduleObjectId })
    .populate('user_id')  // Populates user details
    .populate('module_id')  // Populates module details
    .exec();

  return notes;
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
