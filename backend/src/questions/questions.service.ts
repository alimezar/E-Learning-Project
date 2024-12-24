import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Questions, QuestionDocument } from './questions.schema';
import { Users } from '../users/users.schema';


@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel('Questions') private readonly questionModel: Model<QuestionDocument>,
    @InjectModel('Users') private readonly userModel: Model<Users> // Inject Users model
  ) {}

  // Create a new question
  async createQuestion(questionData: Partial<Questions>): Promise<Questions> {
    const user = await this.userModel.findById(questionData.userId)
        if(user.role != "instructor"){
          throw new BadRequestException("Only an instructor can create a question")
        }
        
    const newQuestion = new this.questionModel(questionData);
    return newQuestion.save();
  }

  // Get all questions
  async getQuestions(): Promise<Questions[]> {
    return this.questionModel.find().populate('moduleId').exec();
  }

  // Get a single question by ID
  async getQuestion(id: string): Promise<Questions> {
    return this.questionModel.findById(id).populate('moduleId').exec();
  }

  // Update a question by ID
  async updateQuestion(id: string, updateData: Partial<Questions>): Promise<Questions> {
    const user = await this.userModel.findById(updateData.userId);
    if (!user || user.role !== "instructor") {
      throw new BadRequestException("Only an instructor can update a question");
    }

    const updatedQuestion = await this.questionModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    if (!updatedQuestion) {
      throw new NotFoundException(`Question with ID "${id}" not found.`);
    }
    return updatedQuestion;
  }

  // Delete a question by ID
  async deleteQuestion(id: string): Promise<Questions> {
    return this.questionModel.findByIdAndDelete(id).exec();
  }
}
