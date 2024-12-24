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
    @InjectModel('Questions') private readonly questionModel: Model<QuestionDocument>, // Inject Question model
    @InjectModel('Progress') private readonly progressModel: Model<ProgressDocument>, // Inject Progress model
    @InjectModel('Users') private readonly userModel: Model<UserDocument> // Inject Users model
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

  const moduleId = new Types.ObjectId(quizData.moduleId); // Convert to ObjectId

  if (!quizData.userId) {
    throw new BadRequestException('userId is required');
  }

  const userId = new Types.ObjectId(quizData.userId); // Convert userId to ObjectId

  // Retrieve the module directly and extract the courseId
  const module = await this.moduleModel.findById(moduleId).exec();
  if (!module) {
    throw new BadRequestException(`Module with ID "${quizData.moduleId}" not found.`);
  }

  console.log(`Fetched module: ${JSON.stringify(module)}`); // Log full module

  const courseId = module.course_id ? new Types.ObjectId(module.course_id) : null;
  if (!courseId) {
    throw new BadRequestException('The associated course ID is missing from the module.');
  }

  console.log(`Looking for progress with userId: ${userId} and courseId: ${courseId}`); // Debug log

  // Fetch the user's role
  const user = await this.userModel.findById(userId).exec();
  if (!user) {
    throw new BadRequestException(`User with ID "${quizData.userId}" not found.`);
  }

  // If the user is an instructor, skip progress checks and create the quiz directly
  if (user.role === 'instructor') {
    console.log('User is an instructor; skipping progress validation.');

    const size = quizData.size ?? 5;

    // Fetch random questions matching the module
    const questions = await this.questionModel.aggregate([
      { $match: { moduleId: quizData.moduleId.toString() } },
      { $sample: { size } },
    ]);

    if (questions.length < size) {
      throw new BadRequestException('Not enough questions available for the quiz.');
    }

    console.log(`Fetched ${questions.length} questions for quiz creation.`);

    // Create and save the new quiz
    const newQuiz = new this.quizModel({
      ...quizData,
      userId,
      moduleId,
      questions,
    });

    return newQuiz.save();
  }

  const progress = await this.progressModel
    .findOne({ userId, courseId })
    .exec();

  if (!progress) {
    throw new BadRequestException(
      `Progress not found for userId "${quizData.userId}" and courseId "${courseId}".`
    );
  }

  if (progress.averageScore === undefined || progress.averageScore === null) {
    throw new BadRequestException(
      'Progress record exists but averageScore is missing or invalid.'
    );
  }

  const averageScore = progress.averageScore;

  // Determine quiz difficulty based on averageScore
  let difficulty: string;

  const size = quizData.size ?? 5;
  const totalQuestions = size;
  const scorePercentage = (averageScore / totalQuestions) * 100;

  console.log('totalQuestions: ' + totalQuestions);
  console.log('scorePercentage: ' + scorePercentage);

  if (scorePercentage < 40) {
    difficulty = 'easy';
  } else if (scorePercentage >= 40 && scorePercentage < 80) {
    difficulty = 'medium';
  } else {
    difficulty = 'hard';
  }

  // Fetch random questions matching the module and difficulty
  const questions = await this.questionModel.aggregate([
    { $match: { moduleId: quizData.moduleId.toString(), difficulty } },
    { $sample: { size: totalQuestions } },
  ]);

  if (questions.length < totalQuestions) {
    throw new BadRequestException('Not enough questions available for the quiz.');
  }

  console.log(`Fetched ${questions.length} questions for quiz creation.`);

  // Create and save the new quiz
  const newQuiz = new this.quizModel({
    ...quizData,
    userId,
    moduleId,
    questions,
  });

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

   // Fetch quizzes by moduleId and creator role
   async getQuizzesByModuleAndRole(moduleId: string, role?: string): Promise<QuizDocument[]> {
    const filter: any = { moduleId: new Types.ObjectId(moduleId) };

    if (role) {
      // If role is specified, populate `userId` and filter by role
      filter['userId.role'] = role;
    }

    const quizzes = await this.quizModel.find(filter).populate('userId').exec();
    if (!quizzes || quizzes.length === 0) {
      throw new NotFoundException('No quizzes found for the given module and role.');
    }

    return quizzes;
  }
  
}
