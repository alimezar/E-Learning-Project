import { Controller, Post, Get, Body, Param, Put, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-users.dto';
import { Users } from './users.schema'; 
import { Course } from 'src/courses/courses.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }


  // Get all users
  @Get()
  async getAllUsers(): Promise<Users[]> {
    return this.usersService.getUsers();
  }

  // Get a single user by email
@Get('email/:email')
async getUserByEmail(@Param('email') email: string): Promise<Users> {
  return this.usersService.getUserByEmail(email);
}

  // Get a single user by ID
  @Get(':id')
  async getUser(@Param('id') id: string): Promise<Users> {
    return this.usersService.getUserById(id);
  }

  // Update a user by ID
  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateData: Partial<Users>,
  ): Promise<Users> {
    return this.usersService.updateUser(id, updateData);
  }

  // Delete a user by ID
  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<void> {
    return this.usersService.deleteUser(id);
  }
  // Enroll a user in a course
  @Post(':userId/enroll/:courseId')
  async enrollUser(
    @Param('userId') userId: string,
    @Param('courseId') courseId: string,
  ): Promise<Users> {
    return this.usersService.enrollUser(userId, courseId);
  }
  // Fetch enrolled courses for a user
@Get(':userId/enrolled-courses')
async getUserEnrolledCourses(@Param('userId') userId: string): Promise<Course[]> {
  return this.usersService.getEnrolledCourses(userId);
}
  
}
