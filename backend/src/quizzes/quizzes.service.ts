import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Quizzes } from './quizzes.schema';
import { Model } from 'mongoose';

@Injectable()
export class QuizService {
  constructor(
    @InjectModel('Quizzes') private readonly quizModel: Model<Quizzes>) {}

  // Create a new quiz
  async createQuiz(quizData: Partial<Quizzes>): Promise<Quizzes> {
    const newQuiz = new this.quizModel(quizData);
    return newQuiz.save();
  }


  // Get all the quizzes
  async getQuizzes(): Promise<Quizzes[]> {
    return this.quizModel.find().exec();
  }


  // Get one quiz by its ID
  async getQuizById(quizId: string): Promise<Quizzes> {
    const quiz = await this.quizModel.findById(quizId).exec();
    if (!quiz) {
      throw new NotFoundException(`Quiz with ID "${quizId}" not found.`);
    }
    return quiz;
  }


  // Update a quiz by its ID
  async updateQuiz(quizId: string, updateData: Partial<Quizzes>): Promise<Quizzes> {
    const updatedQuiz = await this.quizModel
      .findByIdAndUpdate(quizId, updateData, { new: true })
      .exec();

    if (!updatedQuiz) {
      throw new NotFoundException(`Quiz with ID "${quizId}" not found.`);
    }
    return updatedQuiz;
  }


  // Delete a quiz by its ID
  async deleteQuiz(quizId: string): Promise<void> {
    const deletedQuiz = await this.quizModel.findByIdAndDelete(quizId).exec();
    if (!deletedQuiz) {
      throw new NotFoundException(`Quiz with ID "${quizId}" not found.`);
    }
  }
}

