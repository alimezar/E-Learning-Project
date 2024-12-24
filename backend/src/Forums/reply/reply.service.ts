import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reply } from './reply.schema';
import { NotificationService } from '../../notifications/notifications.service';
import { Users } from '../../users/users.schema';
import { Thread } from '../thread/thread.schema'; // Import the Thread schema

@Injectable()
export class ReplyService {
  constructor(
    @InjectModel('Reply') private replyModel: Model<Reply>,
    @InjectModel('Users') private usersModel: Model<Users>, // Inject Users model
    @InjectModel('Thread') private threadModel: Model<Thread>, // Inject Thread model
    private notificationService: NotificationService
  ) {}

  async createReply(threadId: string, content: string, userId: string) {
    // Fetch the user's name
    const user = await this.usersModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Fetch the thread to get the author's ID
    const thread = await this.threadModel.findById(threadId);
    if (!thread) {
      throw new Error('Thread not found');
    }

    const reply = new this.replyModel({
      threadId,
      content,
      userId,
      userName: user.name, // Add userName dynamically from the Users collection
    });

    const savedReply = await reply.save();

    // Notify the thread's author about the new reply
    if (thread.userId.toString() !== userId) {
      await this.notificationService.createNotification(
        thread.userId.toString(), // Notify the thread author
        `${user.name} replied to your thread: "${thread.title}"` // Customize message
      );
    }

    return savedReply;
  }

  async getRepliesForThread(threadId: string) {
    return this.replyModel
      .find({ threadId })
      .populate('userId', 'name') // Populate the user's name from the Users collection
      .exec();
  }

  async updateReply(replyId: string, content: string, userId: string, role: string) {
    const reply = await this.replyModel.findById(replyId);
    if (!reply) {
      throw new Error('Reply not found');
    }

    // Check if the user is authorized to update
    if (reply.userId.toString() !== userId && role !== 'admin' && role !== 'instructor') {
      throw new Error('Unauthorized to edit this reply');
    }

    reply.content = content;
    return reply.save();
  }

  async deleteReply(replyId: string, userId: string, role: string) {
    const reply = await this.replyModel.findById(replyId);
    if (!reply) {
      throw new Error('Reply not found');
    }

    // Check if the user is authorized to delete
    if (reply.userId.toString() !== userId && role !== 'admin' && role !== 'instructor') {
      throw new Error('Unauthorized to delete this reply');
    }

    return this.replyModel.findByIdAndDelete(replyId);
  }
}
