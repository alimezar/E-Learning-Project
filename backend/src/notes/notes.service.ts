import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notes, NoteDocument } from './notes.schema';
import { Users } from '../users/users.schema';
import { Course } from '../courses/courses.schema';

@Injectable()
export class NoteService {
  constructor(
    @InjectModel(Notes.name) private readonly noteModel: Model<NoteDocument>,
    @InjectModel('Users') private readonly userModel: Model<Users>, // Inject Users model
    @InjectModel('Course') private readonly courseModel: Model<Course>, // Inject Courses model
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

  // Create a new Note
  async createNote(noteData: Partial<Notes>): Promise<Notes> {
    const { user_id, course_id } = noteData;

    if (!user_id || !course_id) {
      throw new BadRequestException('Both user_id and course_id are required');
    }

    const userObjectId = new Types.ObjectId(user_id);
    const courseObjectId = new Types.ObjectId(course_id);

    await this.validateUserId(userObjectId);
    await this.validateCourseId(courseObjectId);

    const newNote = new this.noteModel({
      ...noteData,
      user_id: userObjectId,
      course_id: courseObjectId,
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
}
