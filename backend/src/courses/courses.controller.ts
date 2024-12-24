import { Controller, Post, Get, Body, Param, Put, Delete, Query,UnauthorizedException, HttpException, HttpStatus, BadRequestException, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { Course } from './courses.schema';
import { Users } from 'src/users/users.schema';
import { Module, ModuleDocument } from '../modules/modules.schema';
import { AuthorizationGuard } from '../auth/guards/authorization.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import mongoose from 'mongoose';


@Controller('courses')
@UseGuards(AuthorizationGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  
// Create a new course
@Post()
@Roles('instructor') // RBAC Series
async createCourse(@Body() courseData: Partial<Course>): Promise<Course> {
  try {
    return await this.coursesService.createCourse(courseData);
  } catch (error) {
    throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  }
}

@Get(':courseId/versions')
@Roles('instructor', 'admin') 
async getCourseVersions(@Param('courseId') courseId: string): Promise<any[]> {
  return await this.coursesService.getCourseVersions(courseId);
}


@Put(':courseId/unavailable')
@Roles('instructor', 'admin') 
async markCourseUnavailable(@Param('courseId') courseId: string): Promise<void> {
  try {
    await this.coursesService.markCourseUnavailable(courseId);
  } catch (error) {
    throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  }
}

@Get('taught')
  async getTaughtCourses(@Query('instructorId') instructorId: string): Promise<Course[]> {
    console.log('Fetching taught courses for instructor:', instructorId);

    if (!instructorId) {
      throw new BadRequestException('Instructor ID is required.');
    }

    if (!mongoose.Types.ObjectId.isValid(instructorId)) {
      throw new BadRequestException('Invalid Instructor ID format.');
    }

    return this.coursesService.getTaughtCourses(instructorId);
  }

@Get('teachable')
async getTeachableCourses(): Promise<Course[]> {
  return this.coursesService.getTeachableCourses();
}

  // Get all courses
  @Get()
  @Roles('instructor', 'student','admin') // RBAC Series
  async getAllCourses(): Promise<Course[]> {
    return this.coursesService.getAllCourses();
  }
// Get Course Multi-Media resources
@Get(':courseId/resources')
@Roles('student', 'instructor', 'admin') 
async getMultiMediaResources(
  @Param('courseId') courseId: string,
): Promise<string[]> {
  return this.coursesService.getMultiMediaResources(courseId);
}

@Get(':courseId/modules/details')
@Roles('student', 'instructor', 'admin') 
async getCourseModulesWithDetails(
  @Param('courseId') courseId: string,
): Promise<{ courseId: string; modules: Module[] }> {
  return await this.coursesService.getCourseModulesWithDetails(courseId);
}

@Put(':courseId/toggle-availability')
@Roles('instructor', 'admin') // RBAC Series
async toggleCourseAvailability(@Param('courseId') courseId: string): Promise<void> {
  try {
    await this.coursesService.toggleCourseAvailability(courseId);
  } catch (error) {
    throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  }
}


// Get Course Modules 
@Get(':courseId/modules')
@Roles('student', 'instructor', 'admin') 
async getCourseModules(@Param('courseId') courseId: string): Promise<Module[]> {
  return this.coursesService.getModulesByCourse(courseId);
}

  @Get('user/:userId')
  @Roles('student', 'instructor', 'admin') 
async getUserCourses(@Param('userId') userId: string): Promise<Course[]> {
  return this.coursesService.getCoursesByUserId(userId);
}

  // Get a single course by ID
  @Get(':id')
  async getCourse(@Param('id') id: string): Promise<Course> {
    return this.coursesService.getCourseById(id);
  }

  // Update a course by ID
@Put(':courseId')
@Roles('instructor', 'admin') // RBAC Series
async updateCourse(
  @Param('courseId') courseId: string,
  @Body() updateData: Partial<Course>,
): Promise<Course> {
  console.log(`Update request received for course ID: ${courseId}`, updateData);
  return this.coursesService.updateCourse(courseId, updateData);
}

  // Delete a course by ID
  @Delete(':courseId')
  @UseGuards(AuthorizationGuard)
  @Roles('admin') // Only admins can delete courses
  async deleteCourse(@Param('courseId') courseId: string): Promise<{ message: string }> {
    await this.coursesService.deleteCourse(courseId);
    return { message: 'Course deleted successfully' };
  }
  // Search courses by query
@Get('search/:query')
async searchCourses(@Param('query') query: string): Promise<Course[]> {
  return this.coursesService.searchCourses(query);
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

@Get(':courseId/students')
async getStudentsForCourse(@Param('courseId') courseId: string): Promise<Users[]> {
  return this.coursesService.getStudentsForCourse(courseId);
}



@Post('assign/:courseId')
async assignCourse(
  @Param('courseId') courseId: string,
  @Body('instructorId') instructorId: string,
): Promise<Course> {
  // Log the incoming parameters for debugging
  console.log('Assigning course:', { courseId, instructorId });

  if (!instructorId) {
    throw new BadRequestException('Instructor ID is required.');
  }

  if (!mongoose.Types.ObjectId.isValid(instructorId)) {
    throw new BadRequestException('Invalid Instructor ID format.');
  }

  return this.coursesService.assignCourse(courseId, instructorId);
}


}
