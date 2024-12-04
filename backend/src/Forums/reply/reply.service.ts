import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reply } from './reply.schema';
import { NotificationService } from '../../Notification/notification.service'; 

@Injectable()
export class ReplyService {
  constructor(
    @InjectModel('Reply') private replyModel: Model<Reply>,
    private notificationService: NotificationService, 
  ) {}

  async createReply(threadId: string, content: string, userId: string) {
    const reply = new this.replyModel({
      threadId,
      content,
      userId,
    });
    const savedReply = await reply.save();

    // Notify the user about the reply (this can be customized)
    await this.notificationService.createNotification(
      userId,  // Send notification to the user who posted the reply
      `Your reply has been posted successfully!`,
    );

    return savedReply;
  }

  async getRepliesForThread(threadId: string) {
    return this.replyModel.find({ threadId }).exec();
  }
}
