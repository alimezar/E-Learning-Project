import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Quizzes, QuizDocument } from './quizzes.schema';
import { Module, ModuleDocument } from '../modules/modules.schema';
import { Questions, QuestionDocument } from '../questions/questions.schema';
import { Model, Types } from 'mongoose';
import { Progress, ProgressDocument } from '../progress/progress.schema';
import { UserDocument } from '../users/users.schema';


@Injectable()
export class QuizService {
  constructor(
    @InjectModel('Quizzes') private readonly quizModel: Model<QuizDocument>,
    @InjectModel('Module') private readonly moduleModel: Model<ModuleDocument>, // Inject Module model
    @InjectModel('Questions') private readonly questionModel: Model<QuestionDocument>, //inject Question model
    @InjectModel('Progress') private readonly progressModel: Model<ProgressDocument>, //inject Progress model
    @InjectModel('Users') private readonly userModel: Model<UserDocument> //Inject Users model
  ) {}

  // Validate moduleId
  private async validateModuleId(moduleId: Types.ObjectId): Promise<void> {
    const module = await this.moduleModel.findById(moduleId).exec();
    if (!module) {
      throw new BadRequestException(`Invalid moduleId: "${moduleId}"`);
    }
  }

  // Create a new quiz
  async createQuiz(quizData: Partial<Quizzes>): Promise<Quizzes> {
    if (!quizData.moduleId) {
      throw new BadRequestException('moduleId is required');
    }
    const checkModuleId = new Types.ObjectId(quizData.moduleId); // Convert to ObjectId
    await this.validateModuleId(checkModuleId); // Validate moduleId

    const moduleId = quizData.moduleId.toString();
    const module = await this.moduleModel.findById(moduleId);
    const courseId = module.course_id;

    const userId = quizData.userId;

    const progress = await this.progressModel.findOne({userId: new Types.ObjectId(userId) , courseId: new Types.ObjectId(courseId)}).exec();
    const averageScore = progress.averageScore;

    let difficulty;

    if(averageScore < 2){
      difficulty = "easy";
    }
    else if(averageScore >= 2 && averageScore < 4){
      difficulty = "medium";
    }
    else{
      difficulty = "hard";
    }

    const questions = await this.questionModel.aggregate([  
      { $match: { moduleId, difficulty } }, // get questions by moduleId and difficulty
      { $sample: { size: 5 } } // Randomly pick 5 questions
    ]);

    if (questions.length < 5) { // to ensure that we have enough questions
      throw new BadRequestException('Not enough questions available to create a quiz.');
    }

    const newQuiz = new this.quizModel({ ...quizData, userId, moduleId, questions });
    return newQuiz.save();
  }

  // Get all quizzes
  async getQuizzes(): Promise<Quizzes[]> {
    return this.quizModel.find().populate('moduleId').exec(); // Populate moduleId with Module details
  }

  // Get one quiz by its ID
  async getQuizById(quizId: string): Promise<Quizzes> {
    const quiz = await this.quizModel.findById(quizId).populate('moduleId').exec(); // Populate moduleId
    if (!quiz) {
      throw new NotFoundException(`Quiz with ID "${quizId}" not found.`);
    }
    return quiz;
  }

  // Update a quiz by its ID
  async updateQuiz(quizId: string, updateData: Partial<Quizzes>): Promise<Quizzes> {
    if (updateData.moduleId) {
      const moduleId = new Types.ObjectId(updateData.moduleId); // Convert to ObjectId
      await this.validateModuleId(moduleId); // Validate moduleId
    }
    const updatedQuiz = await this.quizModel
      .findByIdAndUpdate(quizId, updateData, { new: true })
      .populate('moduleId')
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
