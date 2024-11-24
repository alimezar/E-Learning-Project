import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response, ResponseDocument } from './responses.schema';

@Injectable()
export class ResponseService {
  constructor(@InjectModel(Response.name) private responseModel: Model<ResponseDocument>) {}

  async createResponse(createResponseDto: Partial<Response>): Promise<Response> {
    const newResponse = new this.responseModel(createResponseDto);
    return newResponse.save();
  }

  async findAllResponses(): Promise<Response[]> {
    return this.responseModel.find().exec();
  }

  async findResponseById(responseId: string): Promise<Response | null> {
    return this.responseModel.findOne({ responseId }).exec();
  }
}
