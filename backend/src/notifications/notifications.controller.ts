import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { NotificationService } from './notifications.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // Create a new notification with optional link
  @Post()
  async createNotification(
    @Body() body: { userId: string; message: string; link?: string }, // Add link to the request body
  ) {
    return this.notificationService.createNotification(
      body.userId,
      body.message,
      body.link, // Pass link to the service
    );
  }

  // Fetch notifications for a specific user
  @Get(':userId')
  async getNotificationsForUser(@Param('userId') userId: string) {
    return this.notificationService.getNotificationsForUser(userId);
  }

  // Mark a notification as read
  @Post('mark-as-read/:notificationId')
  async markNotificationAsRead(@Param('notificationId') notificationId: string) {
    return this.notificationService.markNotificationAsRead(notificationId);
  }
}
