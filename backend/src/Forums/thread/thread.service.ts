import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Thread } from './thread.schema';
import { NotificationService } from '../../notifications/notifications.service'; // Import NotificationService

@Injectable()
export class ThreadService {
  constructor(
    @InjectModel('Thread') private threadModel: Model<Thread>,
    private notificationService: NotificationService, // Inject NotificationService
  ) {}

  async createThread(title: string, content: string, courseId: string, userId: string) {
    const thread = new this.threadModel({
      title,
      content,
      courseId,
      userId,
    });

    const savedThread = await thread.save();

    // Notify the instructor (or other users if required)
    await this.notificationService.createNotification(
      userId,  // Send notification to the user who created the thread
      `Your thread "${title}" has been created successfully!`,
    );

    return savedThread;
  }

  async getAllThreads(courseId: string) {
    return this.threadModel.find({ courseId }).exec();
  }

  async getThreadById(id: string) {
    return this.threadModel.findById(id).exec();
  }
}
