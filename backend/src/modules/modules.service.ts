import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Module, ModuleDocument } from './modules.schema';
import { Course, CourseDocument } from '../courses/courses.schema';

@Injectable()
export class ModulesService {
  constructor(
    @InjectModel(Module.name) private readonly moduleModel: Model<ModuleDocument>,
    @InjectModel(Course.name) private readonly courseModel: Model<CourseDocument>,
  ) {}

  private async validateCourseId(courseId: string): Promise<void> {
    const course = await this.courseModel.findById(courseId).exec();
    if (!course) {
      throw new BadRequestException(`Invalid courseId: "${courseId}"`);
    }
  }

  // Create a new module
  async createModule(
    courseId: string,
    moduleData: { title: string; description: string },
    fileUrls: string[],
  ): Promise<Module> {
    // Ensure the course exists
    const course = await this.courseModel.findById(courseId).exec();
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found.`);
    }
  
    // Construct full URLs for files
    const fullFileUrls = fileUrls.map(
      (file) => `${process.env.BASE_URL || 'http://localhost:3001'}${file}`,
    );
  
    // Create the module
    const newModule = new this.moduleModel({
      ...moduleData,
      resources: fullFileUrls,
      course_id: course._id,
    });
  
    const savedModule = await newModule.save();
  
    // Add the module to the course
    course.modules.push(savedModule._id as unknown as Types.ObjectId); // Explicit cast to ObjectId
    await course.save();
  
    return savedModule;
  }
  
  // Get all modules
  async getAllModules(): Promise<Module[]> {
    return this.moduleModel.find().populate('course_id').exec(); 
  }
  async getModulesByCourseId(courseId: string): Promise<Module[]> {
    return this.moduleModel.find({ course_id: courseId }).exec();
  }
  

  // Get a module by ID
  async getModuleById(moduleId: string): Promise<Module> {
    if (!moduleId) {
      throw new NotFoundException('Module ID is required.');
    }

    const module = await this.moduleModel.findById(moduleId).exec();
    if (!module) {
      throw new NotFoundException(`Module with ID ${moduleId} not found.`);
    }

    return module;
  }

  async updateModule(
    moduleId: string,
    moduleData: { title: string; description: string },
    fileUrls: string[],
  ): Promise<Module> {
    const module = await this.moduleModel.findById(moduleId).exec();
    if (!module) {
      throw new NotFoundException(`Module with ID ${moduleId} not found.`);
    }
  
    // Construct full URLs for new file paths
    const fullFileUrls = fileUrls.map(
      (file) => `${process.env.BASE_URL || 'http://localhost:3001'}${file}`,
    );
  
    // Add new files to resources if provided
    if (fullFileUrls.length > 0) {
      module.resources.push(...fullFileUrls);
    }
  
    // Update title and description if provided
    module.title = moduleData.title || module.title;
    module.description = moduleData.description || module.description;
  
    return await module.save();
  }
  
  

  async removeFileFromModule(moduleId: string, fileUrl: string): Promise<Module> {
    const module = await this.moduleModel.findById(moduleId).exec();
    if (!module) {
      throw new NotFoundException(`Module with ID ${moduleId} not found.`);
    }
  
    module.resources = module.resources.filter((resource) => resource !== fileUrl);
  
    return await module.save();
  }
  
  

  // Delete a module by MongoDB _id
  async deleteModule(_id: string): Promise<void> {
    const result = await this.moduleModel.findByIdAndDelete(_id).exec();
    if (!result) {
      throw new NotFoundException(`Module with ID "${_id}" not found`);
    }
  }
  async getModulesByCourseIdWithCourseDetails(courseId: string): Promise<{ courseId: string; modules: Module[] }> {
    const course = await this.courseModel.findById(courseId).exec();
    if (!course) {
      throw new NotFoundException(`Course with ID "${courseId}" not found`);
    }

    const modules = await this.moduleModel.find({ course_id: courseId }).exec();
    return { courseId, modules };
  }
}