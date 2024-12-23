import { Controller, Post, Get, Body, Param } from '@nestjs/common';
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

}
