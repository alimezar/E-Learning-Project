import { Controller, Post, Get, Body, Param, Put, Delete, Query,UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { Course } from './courses.schema';
import { Users } from 'src/users/users.schema';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  
// Create a new course
@Post()
async createCourse(@Body() courseData: Partial<Course>): Promise<Course> {
  try {
    return await this.coursesService.createCourse(courseData);
  } catch (error) {
    throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  }
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
  // Search courses by query
@Get('search/:query')
async searchCourses(@Param('query') query: string): Promise<Course[]> {
  return this.coursesService.searchCourses(query);
}

// Update course with versioning
@Put(':id/version')
async updateCourseWithVersion(
  @Param('id') id: string,
  @Body() updateData: Partial<Course>,
): Promise<Course> {
  return this.coursesService.updateCourseWithVersion(id, updateData);
}
// Search for a student in a specific course

@Get(':courseId/students/search')
async searchStudentsInCourse(
  @Param('courseId') courseId: string,
  @Query('email') email: string,
) {
  return this.coursesService.searchStudentInCourse(courseId, email);
}
@Get(':courseId/instructors/search')
async searchInstructorInCourse(
  @Param('courseId') courseId: string,
  @Query('name') name: string,
) {
  return this.coursesService.searchInstructorInCourse(courseId, name);
}

}
