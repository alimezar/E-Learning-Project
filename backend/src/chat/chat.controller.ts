import { Controller, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get(':courseId')
  async getMessages(@Param('courseId') courseId: string) {
    // Fetch messages for the given course ID
    return this.chatService.getMessagesByContext('', courseId);
  }
}
