import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notes, NoteDocument } from './notes.schema';
import { Users } from '../users/users.schema';
import { Course } from '../courses/courses.schema';
import { Module } from '../modules/modules.schema';

@Injectable()
export class NoteService {
  constructor(
    @InjectModel(Notes.name) private readonly noteModel: Model<NoteDocument>,
    @InjectModel('Users') private readonly userModel: Model<Users>, // Inject Users model
    @InjectModel('Course') private readonly courseModel: Model<Course>, // Inject Courses model
    @InjectModel('Module') private readonly moduleModel: Model<Module>,
    
  ) {}

  private async validateUserId(userId: Types.ObjectId): Promise<void> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new BadRequestException(`Invalid user_id: "${userId}"`);
    }
  }

  private async validateCourseId(courseId: Types.ObjectId): Promise<void> {
    const course = await this.courseModel.findById(courseId).exec();
    if (!course) {
      throw new BadRequestException(`Invalid course_id: "${courseId}"`);
    }
  }

  private async validateModuleId(moduleId: Types.ObjectId): Promise<void> {
    const module = await this.moduleModel.findById(moduleId).exec();
    if (!module) {
      throw new BadRequestException(`Invalid module_id: "${moduleId}"`);
    }
  }

  // Create a new Note
  async createNote(noteData: Partial<Notes>): Promise<Notes> {
    const { user_id, course_id, module_id } = noteData;

    if (!user_id || !course_id || !module_id) {
      throw new BadRequestException('module_id, user_id and course_id are required');
    }

    const userObjectId = new Types.ObjectId(user_id);
    const courseObjectId = new Types.ObjectId(course_id);
    const moduleObjectId = new Types.ObjectId(module_id);

    await this.validateUserId(userObjectId);
    await this.validateCourseId(courseObjectId);
    await this.validateModuleId(moduleObjectId);


    const newNote = new this.noteModel({
      ...noteData,
      user_id: userObjectId,
      course_id: courseObjectId,
      module_id: moduleObjectId,
    });

    return newNote.save();
  }

  // Get all Notes
  async getNotes(): Promise<Notes[]> {
    return this.noteModel.find().populate('user_id').populate('course_id').exec();
  }

  // Get one Note by its ID
  async getNoteById(noteId: string): Promise<Notes> {
    const note = await this.noteModel.findById(noteId).populate('user_id').populate('course_id').exec();
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

  async getNotesByUserAndModule(userId: string, moduleId: string): Promise<Notes[]> {
    const userObjectId = new Types.ObjectId(userId);
    const moduleObjectId = new Types.ObjectId(moduleId);

    const notes = await this.noteModel
      .find({ user_id: userObjectId, module_id: moduleObjectId })
      .populate('user_id')
      .populate('module_id')
      .exec();
  
    if (!notes.length) {
      throw new NotFoundException(
        `No notes found for user ID "${userId}" and module ID "${moduleId}"`,
      );
    }
    return notes;
  }
}
