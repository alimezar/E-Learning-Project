import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ReplyService } from './reply.service';

@Controller('replies')
export class ReplyController {
  constructor(private readonly replyService: ReplyService) {}

  @Post(':threadId')
  createReply(@Param('threadId') threadId: string, @Body() createReplyDto: { content: string; userId: string }) {
    return this.replyService.createReply(threadId, createReplyDto.content, createReplyDto.userId);
  }

  @Get(':threadId')
  getRepliesForThread(@Param('threadId') threadId: string) {
    return this.replyService.getRepliesForThread(threadId);
  }
}
