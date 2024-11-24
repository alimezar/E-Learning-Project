import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { Progress } from './progress.schema';
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post(':userId/:courseId')
  async initializeProgress(
    @Param('userId') userId: string,
    @Param('courseId') courseId: string,
  ) {
    return this.progressService.createProgress(userId, courseId);
  }

  @Get(':userId/:courseId')
  async getProgress(
    @Param('userId') userId: string,
    @Param('courseId') courseId: string,
  ) {
    return this.progressService.getProgress(userId, courseId);
  }

  @Put(':userId/:courseId')
  async updateProgress(
    @Param('userId') userId: string,
    @Param('courseId') courseId: string,
    @Body() updateData: Partial<Progress>,
  ) {
    return this.progressService.updateProgress(userId, courseId, updateData);
  }

  @Put(':userId/:courseId/complete/:moduleId')
  async completeModule(
    @Param('userId') userId: string,
    @Param('courseId') courseId: string,
    @Param('moduleId') moduleId: string,
  ) {
    return this.progressService.completeModule(userId, courseId, moduleId);
  }
}