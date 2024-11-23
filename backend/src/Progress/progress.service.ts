import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Progress, ProgressDocument } from './progress.schema';

@Injectable()
export class ProgressService {
  constructor(
    @InjectModel(Progress.name) private readonly progressModel: Model<ProgressDocument>,
  ) {}
  async createProgress(userId: string, courseId: string): Promise<Progress> {
    const existingProgress = await this.progressModel.findOne({ userId, courseId }).exec();
    if (existingProgress) {
      return existingProgress; 
    }

    const progress = new this.progressModel({ userId, courseId, completedPercentage: 0 });
    return progress.save();
  }

  async getProgress(userId: string, courseId: string): Promise<Progress> {
    const progress = await this.progressModel.findOne({ userId, courseId }).exec();
    if (!progress) {
      throw new NotFoundException(`Progress for user ${userId} in course ${courseId} not found.`);
    }
    return progress;
  }

  async updateProgress(
    userId: string,
    courseId: string,
    updateData: Partial<Progress>,
  ): Promise<Progress> {
    const progress = await this.progressModel.findOneAndUpdate(
      { userId, courseId },
      { $set: updateData },
      { new: true }, 
    ).exec();

    if (!progress) {
      throw new NotFoundException(`Progress for user ${userId} in course ${courseId} not found.`);
    }

    return progress;
  }

  async completeModule(userId: string, courseId: string, moduleId: string): Promise<Progress> {
    const progress = await this.progressModel.findOneAndUpdate(
      { userId, courseId },
      {
        $addToSet: { completedModules: moduleId },
      },
      { new: true },
    ).exec();

    if (!progress) {
      throw new NotFoundException(`Progress for user ${userId} in course ${courseId} not found.`);
    }


    const totalModules = 10; 
    const completedPercentage = (progress.completedModules.length / totalModules) * 100;

    return this.progressModel.findOneAndUpdate(
      { userId, courseId },
      { completedPercentage },
      { new: true },
    ).exec();
  }
}
