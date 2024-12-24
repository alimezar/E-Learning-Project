import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Logs, LogDocument } from './logs.schema';

@Injectable()
export class LogsService {
  constructor(@InjectModel(Logs.name) private readonly logModel: Model<LogDocument>) {}

  // Create a log entry
  async createLog(
    type: 'failed_login' | 'unauthorized_access' | 'instructor_request',
    message: string,
    ip: string,
    userId?: string,
    email?: string,
  ): Promise<Logs> {
    const log = new this.logModel({ type, message, ip, userId, email });
    return log.save();
  }

  // Retrieve all logs
  async getAllLogs(limit = 50): Promise<Logs[]> {
    return this.logModel.find().sort({ timestamp: -1 }).limit(limit).exec();
  }

  async deleteLog(type: 'instructor_request', userId: string): Promise<void> {
    await this.logModel.deleteOne({ type, userId }).exec();
  }
  
  async getLogByUserId(userId: string, type: 'instructor_request'): Promise<Logs | null> {
    return this.logModel.findOne({ userId, type }).exec();
  }
  
}
