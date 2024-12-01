import { Controller, Post, Get, Body, Param, Put, Delete } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { Course } from './courses.schema';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  // Create a new course
  @Post()
  async createCourse(@Body() courseData: Partial<Course>): Promise<Course> {
    return this.coursesService.createCourse(courseData);
  }

  // Get all courses
  @Get()
  async getAllCourses(): Promise<Course[]> {
    return this.coursesService.getAllCourses();
  }

  @Get('user/:userId')
async getUserCourses(@Param('userId') userId: string): Promise<Course[]> {
  return this.coursesService.getCoursesByUserId(userId);
}

  // Get a single course by ID
  @Get(':id')
  async getCourse(@Param('id') id: string): Promise<Course> {
    return this.coursesService.getCourseById(id);
  }

  // Update a course by ID
  @Put(':id')
  async updateCourse(
    @Param('id') id: string,
    @Body() updateData: Partial<Course>,
  ): Promise<Course> {
    return this.coursesService.updateCourse(id, updateData);
  }

  // Delete a course by ID
  @Delete(':id')
  async deleteCourse(@Param('id') id: string): Promise<void> {
    return this.coursesService.deleteCourse(id);
  }
}
