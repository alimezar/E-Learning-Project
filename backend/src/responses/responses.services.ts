import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Response, ResponseDocument } from './responses.schema';
import { Quizzes } from '../quizzes/quizzes.schema';
import { Users } from '../users/users.schema';

@Injectable()
export class ResponseService {
  constructor(
    @InjectModel(Response.name) private responseModel: Model<ResponseDocument>,
    @InjectModel('Quizzes') private quizModel: Model<Quizzes>, // Inject Quiz model
    @InjectModel('Users') private userModel: Model<Users>, // Inject User model
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
  async createResponse(createResponseDto: Partial<Response>): Promise<Response> {
    const { quizId, userId } = createResponseDto;

    if (!quizId || !userId) {
      throw new BadRequestException('Both quizId and userId are required');
    }

    const quizObjectId = new Types.ObjectId(quizId);
    const userObjectId = new Types.ObjectId(userId);

    await this.validateQuizId(quizObjectId);
    await this.validateUserId(userObjectId);

    const newResponse = new this.responseModel({ ...createResponseDto, quizId: quizObjectId, userId: userObjectId });
    return newResponse.save();
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
