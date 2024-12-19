import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reply } from './reply.schema';
import { NotificationService } from '../../notifications/notifications.service';
import { Users } from '../../users/users.schema';

@Injectable()
export class ReplyService {
  constructor(
    @InjectModel('Reply') private replyModel: Model<Reply>,
    @InjectModel('Users') private usersModel: Model<Users>, // Inject Users model
    private notificationService: NotificationService,
  ) {}

  async createReply(threadId: string, content: string, userId: string) {
    // Fetch the user's name
    const user = await this.usersModel.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    const reply = new this.replyModel({
      threadId,
      content,
      userId,
      userName: user.name, // Add userName dynamically from the Users collection
    });

    const savedReply = await reply.save();

    // Notify the user about the reply (this can be customized)
    await this.notificationService.createNotification(
      userId, // Send notification to the user who posted the reply
      `Your reply has been posted successfully!`,
    );

    return savedReply;
  }

  async getRepliesForThread(threadId: string) {
    return this.replyModel
      .find({ threadId })
      .populate('userId', 'name') // Populate the user's name from the Users collection
      .exec();
  }
}
