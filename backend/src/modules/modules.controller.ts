import {Controller, Get, Post, Put, Delete, Param, Body, HttpException, HttpStatus} from '@nestjs/common';
import { ModulesService } from './modules.service';
import { Module } from './modules.schema';

@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  // Create a new module
  @Post()
  async createModule(@Body() moduleData: Partial<Module>): Promise<Module> {
      return this.modulesService.createModule(moduleData);
     
  }

  // Get all modules
  @Get()
  async getAllModules(): Promise<Module[]> {
    return this.modulesService.getAllModules();
  }

  // Get a single module by MongoDB _id
  @Get(':id')
  async getModuleById(@Param('id') id: string): Promise<Module> {
    return this.modulesService.getModuleById(id);
  }

  // Update a module by MongoDB _id
  @Put(':id')
  async updateModule(
    @Param('id') id: string,
    @Body() updateData: Partial<Module>,
  ): Promise<Module> {
    try {
      return this.modulesService.updateModule(id, updateData);
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.NOT_FOUND);
    }
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
}
