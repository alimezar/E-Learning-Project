import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Module } from './modules.schema';

@Injectable()
export class ModulesService {
  constructor(@InjectModel(Module.name) private readonly moduleModel: Model<Module>) {}

  // Create a new module
  async createModule(moduleData: Partial<Module>): Promise<Module> {
    const newModule = new this.moduleModel(moduleData);
    return await newModule.save();
  }

  // Get all modules
  async getAllModules(): Promise<Module[]> {
    return await this.moduleModel.find().exec();
  }

  // Get a module by ID
  async getModuleById(id: string): Promise<Module> {
    const module = await this.moduleModel.findById(id).exec();
    if (!module) {
      throw new NotFoundException(`Module with ID "${id}" not found`);
    }
    return module;
  }

  // Update a module by ID
  async updateModule(id: string, updateData: Partial<Module>): Promise<Module> {
    const updatedModule = await this.moduleModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    if (!updatedModule) {
      throw new NotFoundException(`Module with ID "${id}" not found`);
    }
    return updatedModule;
  }

  // Delete a module by ID
  async deleteModule(id: string): Promise<void> {
    const result = await this.moduleModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Module with ID "${id}" not found`);
    }
  }
}
