import { Controller, Get, Post, Put, Delete, Param, Body, HttpException, HttpStatus, UseInterceptors, UploadedFiles, NotFoundException } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { Module } from './modules.schema';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerConfig, multerOptions } from '../multer.config';

@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  // Create a new module
  @Post(':courseId')
  @UseInterceptors(FilesInterceptor('files', 5, multerConfig))
  async createModule(
    @Param('courseId') courseId: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() moduleData: { title: string; description: string },
  ) {
    // Extract file URLs
    const fileUrls = files.map((file) => `/uploads/modules/${file.filename}`);
    return this.modulesService.createModule(courseId, moduleData, fileUrls);
  }
  // Get all modules
  @Get()
  async getAllModules(): Promise<Module[]> {
    return this.modulesService.getAllModules();
  }

  // Get a single module by MongoDB _id
  @Get(':moduleId')
async getModuleById(@Param('moduleId') moduleId: string) {
  const module = await this.modulesService.getModuleById(moduleId);
  if (!module) {
    throw new NotFoundException(`Module with ID ${moduleId} not found.`);
  }
  return module;
}

  // Update a module by MongoDB _id
  @Put(':moduleId')
  @UseInterceptors(FilesInterceptor('files', 5, multerConfig))
  async updateModule(
    @Param('moduleId') moduleId: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() moduleData: { title: string; description: string },
  ) {
    const fileUrls = files.map((file) => `/uploads/modules/${file.filename}`);
    return this.modulesService.updateModule(moduleId, moduleData, fileUrls);
  }

  @Put(':moduleId/remove-file')
  async removeFileFromModule(
    @Param('moduleId') moduleId: string,
    @Body('fileUrl') fileUrl: string,
  ) {
    return this.modulesService.removeFileFromModule(moduleId, fileUrl);
  }


  // Delete a module by MongoDB _id
  @Delete(':id')
  async deleteModule(@Param('id') id: string): Promise<{ message: string }> {
    try {
      await this.modulesService.deleteModule(id);
      return { message: `Module with ID "${id}" successfully deleted` };
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.NOT_FOUND);
    }
  }
  // Get Modules details for Courses
  @Get('course/:courseId')
  async getModulesByCourseId(@Param('courseId') courseId: string): Promise<{ courseId: string; modules: Module[] }> {
    return this.modulesService.getModulesByCourseIdWithCourseDetails(courseId);
  }
}
