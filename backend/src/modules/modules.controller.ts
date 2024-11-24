import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { ModulesService } from './modules.service';
  import { Module } from './modules.schema';
  
  @Controller('modules')
  export class ModulesController {
    constructor(private readonly modulesService: ModulesService) {}
  
    // Create a new module
    @Post()
    async createModule(@Body() moduleData: Partial<Module>): Promise<Module> {
      try {
        return await this.modulesService.createModule(moduleData);
      } catch (error) {
        throw new HttpException('Error creating module', HttpStatus.BAD_REQUEST);
      }
    }
  
    // Get all modules
    @Get()
    async getAllModules(): Promise<Module[]> {
      return await this.modulesService.getAllModules();
    }
  
    // Get a single module by ID
    @Get(':id')
    async getModuleById(@Param('id') id: string): Promise<Module> {
      return await this.modulesService.getModuleById(id);
    }
  
    // Update a module by ID
    @Put(':id')
    async updateModule(
      @Param('id') id: string,
      @Body() updateData: Partial<Module>,
    ): Promise<Module> {
      try {
        return await this.modulesService.updateModule(id, updateData);
      } catch (error) {
        throw new HttpException('Error updating module', HttpStatus.NOT_FOUND);
      }
    }
  
    // Delete a module by ID
    @Delete(':id')
    async deleteModule(@Param('id') id: string): Promise<{ message: string }> {
      try {
        await this.modulesService.deleteModule(id);
        return { message: `Module with ID "${id}" successfully deleted` };
      } catch (error) {
        throw new HttpException('Error deleting module', HttpStatus.NOT_FOUND);
      }
    }
  }
  