import { Controller, Get, Param, Query } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // Fetch messages by courseId
  @Get(':courseId')
  async getMessagesByCourse(@Param('courseId') courseId: string) {
    try {
      return await this.chatService.getMessagesByContext(courseId);
    } catch (error) {
      console.error('Error fetching messages for course:', courseId, error);
      throw error;
    }
  }
    // Fetch messages for 1-on-1 chat by userId and receiverId
  @Get('one-to-one/:userId')
  async getOneToOneMessages(
    @Param('userId') userId: string,
    @Query('receiverId') receiverId: string
  ) {
    return this.chatService.getMessagesByContext(receiverId); // Fetch 1-on-1 messages
  }
}
