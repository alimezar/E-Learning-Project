import { Controller, Get, Post, Put, Body } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { Progress } from './progress.schema';

@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post()
  async initializeProgress(@Body() data: { userId: string, courseId: string }) {
    const { userId, courseId } = data;
    return this.progressService.createProgress(userId, courseId);
  }

  @Get()
  async getProgress(@Body() data: { userId: string, courseId: string }) {
    const { userId, courseId } = data;
    return this.progressService.getProgress(userId, courseId);
  }

  @Put()
  async updateProgress(
    @Body() data: { userId: string, courseId: string, updateData: Partial<Progress> }
  ) {
    const { userId, courseId, updateData } = data;
    return this.progressService.updateProgress(userId, courseId, updateData);
  }

  @Put('complete')
  async completeModule(
    @Body() data: { userId: string, courseId: string, moduleId: string }
  ) {
    const { userId, courseId, moduleId } = data;
    return this.progressService.completeModule(userId, courseId, moduleId);
  }

  // Get course metrics (completion rate, avg score, avg time spent)
  @Get('course-metrics')
  async getCourseMetrics(@Body() data: { courseId: string }) {
    const { courseId } = data;
    return this.progressService.getCourseMetrics(courseId);
  }
}
