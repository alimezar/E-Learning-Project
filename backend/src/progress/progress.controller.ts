import { Controller, Get, Post, Put, Body } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { Progress } from './progress.schema';

@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get()
  async getAllProgress(): Promise<Progress[]> {
    return this.progressService.getAllProgress();
  }
  
  @Post()
  async initializeProgress(@Body() body: { userId: string; courseId: string }) {
    return this.progressService.createProgress(body.userId, body.courseId);
  }

  @Get()
  async getProgress(@Body() body: { userId: string; courseId: string }) {
    return this.progressService.getProgress(body.userId, body.courseId);
  }

  @Put()
  async updateProgress(
    @Body() body: { userId: string; courseId: string; updateData: Partial<Progress> },
  ) {
    return this.progressService.updateProgress(body.userId, body.courseId, body.updateData);
  }

  @Put('complete')
  async completeModule(
    @Body() body: { userId: string; courseId: string; moduleId: string },
  ) {
    return this.progressService.completeModule(body.userId, body.courseId, body.moduleId);
  }

  // =============================================== INSTRUCTOR PROGRESS ===============================================
  @Get('student')
  async getStudentProgress(@Body() body: { courseId: string }) {
    return this.progressService.getStudentProgressByCourse(body.courseId);
  }

}
