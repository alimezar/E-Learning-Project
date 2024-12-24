import { Controller, Post, Get, Put, Delete, Body, Param } from '@nestjs/common';
import { ReplyService } from './reply.service';

@Controller('replies')
export class ReplyController {
  constructor(private readonly replyService: ReplyService) {}

  @Post(':threadId')
  createReply(
    @Param('threadId') threadId: string,
    @Body() createReplyDto: { content: string; userId: string }
  ) {
    return this.replyService.createReply(
      threadId,
      createReplyDto.content,
      createReplyDto.userId
    );
  }

  @Get(':threadId')
  getRepliesForThread(@Param('threadId') threadId: string) {
    return this.replyService.getRepliesForThread(threadId);
  }

  @Put(':replyId')
  updateReply(
    @Param('replyId') replyId: string,
    @Body() updateReplyDto: { content: string; userId: string; role: string }
  ) {
    return this.replyService.updateReply(replyId, updateReplyDto.content, updateReplyDto.userId, updateReplyDto.role);
  }

  @Delete(':replyId')
  deleteReply(
    @Param('replyId') replyId: string,
    @Body() deleteReplyDto: { userId: string; role: string }
  ) {
    return this.replyService.deleteReply(replyId, deleteReplyDto.userId, deleteReplyDto.role);
  }
}
