import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Thread } from './thread.schema';
import { NotificationService } from '../../notifications/notifications.service'; // Import NotificationService
import { Users } from '../../users/users.schema';  // Make sure to import Users schema

@Injectable()
export class ThreadService {
  constructor(
    @InjectModel('Thread') private threadModel: Model<Thread>,
    @InjectModel('Users') private usersModel: Model<Users>, // Inject Users model
    private notificationService: NotificationService, // Inject NotificationService
  ) {}

  async createThread(title: string, content: string, courseId: string, userId: string) {
    // Fetch the user's name
    const user = await this.usersModel.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    const thread = new this.threadModel({
      title,
      content,
      courseId,
      userId,
      userName: user.name, // Add userName dynamically from the Users collection
    });

    const savedThread = await thread.save();

    // Notify the user who created the thread
    await this.notificationService.createNotification(
      userId,  // Send notification to the user who created the thread
      `Your thread "${title}" has been created successfully!`,
    );

    return savedThread;
  }

  async getAllThreads(courseId: string) {
    return this.threadModel
      .find({ courseId })
      .populate('userId', 'name')  // Populate the user's name from the Users collection
      .exec();
  }

  async getThreadById(id: string) {
    return this.threadModel
      .findById(id)
      .populate('userId', 'name')  // Populate the user's name from the Users collection
      .exec();
  }
}
