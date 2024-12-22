import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Module, ModuleDocument } from './modules.schema';
import { Course } from '../courses/courses.schema';

@Injectable()
export class ModulesService {
  constructor(
    @InjectModel(Module.name) private readonly moduleModel: Model<ModuleDocument>,
    @InjectModel(Course.name) private readonly courseModel: Model<Course>,
  ) {}

  private async validateCourseId(courseId: string): Promise<void> {
    const course = await this.courseModel.findById(courseId).exec();
    if (!course) {
      throw new BadRequestException(`Invalid courseId: "${courseId}"`);
    }
  }

  // Create a new module
  async createModule(moduleData: Partial<Module>): Promise<Module> {
    // Convert course_id to ObjectId
    const courseId = new Types.ObjectId(moduleData.course_id);
    await this.validateCourseId(courseId.toString());
    
    // Update the module data with the ObjectId course_id
    moduleData.course_id = courseId;

    const newModule = new this.moduleModel(moduleData);
    const savedModule = await newModule.save();

    // Update the course's modules field to include the new module
    await this.courseModel.findByIdAndUpdate(courseId, {
        $push: { modules: savedModule._id },
    });

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
  async getModuleById(_id: string): Promise<Module> {
    const module = await this.moduleModel.findById(_id).populate('courseId').exec();
    if (!module) {
      throw new NotFoundException(`Module with ID "${_id}" not found`);
    }
    return module;
  }

  async updateModule(_id: string, updateData: Partial<Module>): Promise<Module> {
    if (updateData.course_id) {
      await this.validateCourseId(updateData.course_id.toString());
    }
    const updatedModule = await this.moduleModel
      .findByIdAndUpdate(_id, updateData, { new: true })
      .populate('courseId')
      .exec();
    if (!updatedModule) {
      throw new NotFoundException(`Module with ID "${_id}" not found`);
    }
    return updatedModule;
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