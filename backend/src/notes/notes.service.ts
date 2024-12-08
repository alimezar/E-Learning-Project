import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { NotesDocument } from './notes.schema';
import { CreateNotesDto } from './dto/create-notes.dto';
import { UserDocument } from '../users/users.schema';  // Correct import for UserModel

@Injectable()
export class NotesService {
  constructor(
    @InjectModel('Notes') private readonly notesModel: Model<NotesDocument>,
    @InjectModel('Users') private readonly userModel: Model<UserDocument>,  // Inject UserModel here
  ) {}

  // Dynamically fetch user_id based on content
  async findUserByContent(content: string): Promise<string> {
    const user = await this.userModel.findOne({ associatedContent: content }).exec();
    if (!user) {
      throw new NotFoundException('User not found for the provided content.');
    }
    return user._id.toString();  // Return user_id
  }

  // Create a new note
  async create(createNotesDto: CreateNotesDto): Promise<NotesDocument> {
    const user_id = await this.findUserByContent(createNotesDto.content);

    const newNote = new this.notesModel({
      user_id: new Types.ObjectId(user_id),
      content: createNotesDto.content,
      createdAt: new Date(),
    });

    return newNote.save();
  }

  // Delete a note by ID
  async remove(id: string): Promise<void> {
    const result = await this.notesModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Note not found');
    }
  }

  // Get all notes by user_id
  async findAll(user_id: string): Promise<NotesDocument[]> {
    return this.notesModel.find({ user_id: new Types.ObjectId(user_id) }).exec();
  }

  // Find a single note by its ID
  async findOne(id: string): Promise<NotesDocument> {
    const note = await this.notesModel.findById(id).exec();
    if (!note) {
      throw new NotFoundException('Note not found');
    }
    return note;
  }
}
