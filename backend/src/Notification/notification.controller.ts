import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  async createNotification(
    @Body() body: { userId: string; message: string },
  ) {
    return this.notificationService.createNotification(
      body.userId,
      body.message,
    );
  }

  @Get(':userId')
  async getNotificationsForUser(@Param('userId') userId: string) {
    return this.notificationService.getNotificationsForUser(userId);
  }

  @Post('mark-as-read/:notificationId')
  async markNotificationAsRead(@Param('notificationId') notificationId: string) {
    return this.notificationService.markNotificationAsRead(notificationId);
  }
}
