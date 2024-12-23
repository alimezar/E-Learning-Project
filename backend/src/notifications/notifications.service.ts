import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './notifications.schema';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel('Notification') private notificationModel: Model<Notification>,
  ) {}

  // Create a new notification with an optional link
  async createNotification(userId: string, message: string, link?: string) {
    const notification = new this.notificationModel({
      userId,
      message,
      link, // Include link in the notification
      read: false,
    });
    return notification.save();
  }

  // Fetch notifications for a specific user
  async getNotificationsForUser(userId: string) {
    return this.notificationModel.find({ userId }).sort({ createdAt: -1 }).exec(); // Sort by newest first
  }

  // Mark a specific notification as read
  async markNotificationAsRead(notificationId: string) {
    return this.notificationModel.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true },
    );
  }
}
