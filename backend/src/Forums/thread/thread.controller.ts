import { Controller, Post, Get,Put,Delete, Body, Param } from '@nestjs/common';
import { ThreadService } from './thread.service';

@Controller('threads')
export class ThreadController {
  constructor(private readonly threadService: ThreadService) {}

  @Post()
  createThread(@Body() createThreadDto: { title: string; content: string; courseId: string; userId: string }) {
    return this.threadService.createThread(createThreadDto.title, createThreadDto.content, createThreadDto.courseId, createThreadDto.userId);
  }

  @Get(':courseId')
  getThreadsByCourse(@Param('courseId') courseId: string) {
    return this.threadService.getAllThreads(courseId);
  }

  @Get('thread/:id')
  getThreadById(@Param('id') id: string) {
    return this.threadService.getThreadById(id);
  }

  @Get('search/:title')
searchThreadsByTitle(@Param('title') title: string) {
  return this.threadService.searchThreadsByTitle(title);
}

@Put(':id')
  async updateThread(
    @Param('id') threadId: string,
    @Body() updateData: { title?: string; content?: string; userId: string; role: string }
  ) {
    return this.threadService.updateThread(threadId, updateData.userId, updateData.role, updateData);
  }

  @Delete(':id')
  async deleteThread(
    @Param('id') threadId: string,
    @Body() deleteData: { userId: string; role: string }
  ) {
    return this.threadService.deleteThread(threadId, deleteData.userId, deleteData.role);
  }

}
