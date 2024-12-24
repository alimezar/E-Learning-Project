import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Response, ResponseDocument } from './responses.schema';
import { Quizzes } from '../quizzes/quizzes.schema';
import { Users } from '../users/users.schema';
import { Progress } from '../progress/progress.schema';
import { Module } from '../modules/modules.schema';
import { Questions, QuestionDocument } from '../questions/questions.schema';
import { Course } from '../courses/courses.schema';

@Injectable()
export class ResponseService {
  constructor(
    @InjectModel(Response.name) private responseModel: Model<ResponseDocument>,
    @InjectModel('Quizzes') private quizModel: Model<Quizzes>,
    @InjectModel('Users') private userModel: Model<Users>,
    @InjectModel('Progress') private readonly progressModel: Model<Progress>,
    @InjectModel('Module') private readonly moduleModel: Model<Module>,
    @InjectModel('Questions') private readonly questionModel: Model<QuestionDocument>,
    @InjectModel('Course') private readonly courseModel: Model<Course>,
  ) {}

  private async validateQuizId(quizId: Types.ObjectId): Promise<void> {
    const quiz = await this.quizModel.findById(quizId).exec();
    if (!quiz) {
      throw new BadRequestException(`Invalid quizId: "${quizId}"`);
    }
  }

  private async validateUserId(userId: Types.ObjectId): Promise<void> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new BadRequestException(`Invalid userId: "${userId}"`);
    }
  }

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
    });

    const totalQuestions = quiz.questions.length;
    const passingScore = Math.ceil(totalQuestions / 2);
    const passed = score >= passingScore;

    const moduleId = quiz.moduleId;
    const module = await this.moduleModel.findById(moduleId);
    const courseId = module.course_id;

    const questions = quiz.questions;
    const newResponse = new this.responseModel({
      ...responseData,
      quizId,
      userId,
      courseId,
      score,
      questions,
      passed,
    });
    await newResponse.save();

    const responses = await this.responseModel.find({ userId, courseId });

    let totalScore = 0;
    responses.forEach((response) => {
      totalScore += response.score;
    });

    const updatedScore = totalScore / responses.length;

    const progress = await this.progressModel
      .findOne({ userId: new Types.ObjectId(userId), courseId: new Types.ObjectId(courseId) })
      .exec();

    if (progress) {
      progress.averageScore = updatedScore;
      await progress.save();
    }

    return newResponse;
  }

  async findAllResponses(): Promise<Response[]> {
    return this.responseModel.find().populate('quizId').populate('userId').exec();
  }

  async findResponseById(responseId: string): Promise<Response | null> {
    return this.responseModel.findById(responseId).populate('quizId').populate('userId').exec();
  }

  // Check if a response exists for a quiz and user
  async getResponsesByQuizAndUser(quizId: string, userId: string): Promise<ResponseDocument[]> {
    return this.responseModel.find({
      quizId: new Types.ObjectId(quizId),
      userId: new Types.ObjectId(userId),
    }).exec();
  }
}
