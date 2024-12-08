import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './notifications.schema';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel('Notification') private notificationModel: Model<Notification>,
  ) {}

  async createNotification(userId: string, message: string) {
    const notification = new this.notificationModel({
      userId,
      message,
      read: false,
    });
    return notification.save();
  }

  async getNotificationsForUser(userId: string) {
    return this.notificationModel.find({ userId }).exec();
  }

  async markNotificationAsRead(notificationId: string) {
    return this.notificationModel.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true },
    );
  }
}
