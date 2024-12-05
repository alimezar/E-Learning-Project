import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Questions, QuestionDocument } from './questions.schema';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel('Questions') private readonly questionModel: Model<QuestionDocument>,
  ) {}

  // Create a new question
  async createQuestion(createQuestionDto: any): Promise<Questions> {
    const newQuestion = new this.questionModel(createQuestionDto);
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
    const updatedQuestion = await this.questionModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    return updatedQuestion;  
  }

  // Delete a question by ID
  async deleteQuestion(id: string): Promise<Questions> {
    return this.questionModel.findByIdAndDelete(id).exec();
  }
}
