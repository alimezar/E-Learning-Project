import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Response, ResponseDocument } from './responses.schema';
import { Quizzes } from '../quizzes/quizzes.schema';
import { Users } from '../users/users.schema';
import { Progress } from '../progress/progress.schema';
import { Module } from '../modules/modules.schema'


@Injectable()
export class ResponseService {
  constructor(
    @InjectModel(Response.name) private responseModel: Model<ResponseDocument>,
    @InjectModel('Quizzes') private quizModel: Model<Quizzes>, // Inject Quiz model
    @InjectModel('Users') private userModel: Model<Users>, // Inject User model
    @InjectModel('Progress') private readonly progressModel: Model<Progress>, //Inject Progress model
    @InjectModel('Module') private readonly moduleModel: Model<Module>, //Inject Module model
  ) {}

  // Validate quizId
  private async validateQuizId(quizId: Types.ObjectId): Promise<void> {
    const quiz = await this.quizModel.findById(quizId).exec();
    if (!quiz) {
      throw new BadRequestException(`Invalid quizId: "${quizId}"`);
    }
  }

  // Validate userId
  private async validateUserId(userId: Types.ObjectId): Promise<void> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new BadRequestException(`Invalid userId: "${userId}"`);
    }
  }

  // Create a new response
  async createResponse(responseData: Partial<Response>): Promise<Response> {
    const { quizId, userId } = responseData;

    if (!quizId || !userId) {
      throw new BadRequestException('Both quizId and userId are required');
    }

    const quizObjectId = new Types.ObjectId(quizId);
    const userObjectId = new Types.ObjectId(userId);

    await this.validateQuizId(quizObjectId);
    await this.validateUserId(userObjectId);

    const quiz = await this.quizModel.findById(quizId);

    let score = 0;  

    quiz.questions.forEach((question: any) => {
      if (question.choice === question.answer) {
        score++;
      }
    })

    const newResponse = new this.responseModel({ ...responseData, quizId, userId, score });
    await newResponse.save();

    const moduleId = quiz.moduleId;
    const module = await this.moduleModel.findById(moduleId);

    const courseId = module.course_id;

    // Get all responses for the user and course
    const responses = await this.responseModel.find({ userId, quizId });

    // Calculate total score from all responses
    const totalScore = responses.reduce((total, response) => total + response.score, 0);  // no need to add (+ score) since it's saved in the database after newResponse.save(), so now it's actually part of the response.score here

    // Calculate the new average score
    const updatedScore = totalScore / responses.length;

    // Find the user's progress and update the average score
    const progress = await this.progressModel.findOne({ userId, courseId });

    if (progress) {
      progress.averageScore = updatedScore;
      await progress.save();
    }

    return newResponse;

  }

  // Get all responses
  async findAllResponses(): Promise<Response[]> {
    return this.responseModel.find().populate('quizId').populate('userId').exec();
  }

  // Get a response by ID
  async findResponseById(responseId: string): Promise<Response | null> {
    return this.responseModel.findById(responseId).populate('quizId').populate('userId').exec();
  }
}
