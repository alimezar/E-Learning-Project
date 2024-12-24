import { Controller, Post, Get, Body, Param, Put, Delete, BadRequestException, Req, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-users.dto';
import { Users } from './users.schema'; 
import { Course } from 'src/courses/courses.schema';
import { AuthorizationGuard } from '../auth/guards/authorization.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { LogsService } from '../logs/logs.service';



@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService,
    private readonly logsService: LogsService,
  ) {}
  

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Delete('self')
  async deleteSelf(@Body('userId') userId: string): Promise<{ message: string }> {
    if (!userId) {
      throw new BadRequestException('User ID is missing.');
    }

    await this.usersService.deleteUser(userId);
    return { message: 'User account deleted successfully.' };
  }
  // Get all users
  @Get('all')
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

@Post(':userId/enrollInstructor/:courseId')
  async enrollInstructor(
    @Param('userId') userId: string,
    @Param('courseId') courseId: string,
  ): Promise<Users> {
    return this.usersService.enrollInstructor(userId, courseId);
  }

  @Post('request-instructor')
async requestInstructor(@Req() req) {
  const userCookie = req.cookies?.user;
  if (!userCookie) {
    throw new HttpException('User not authenticated', HttpStatus.UNAUTHORIZED);
  }

  try {
    // Parse and validate user data from the cookie
    const user = JSON.parse(decodeURIComponent(userCookie));

    if (!user.id || !user.name) {
      throw new HttpException('Invalid user data in cookie', HttpStatus.BAD_REQUEST);
    }

    // Check if a request already exists
    const existingLog = await this.logsService.getLogByUserId(user.id, 'instructor_request');
    if (existingLog) {
      throw new HttpException('Request already exists', HttpStatus.CONFLICT);
    }

    // Log the request
    await this.logsService.createLog(
      'instructor_request',
      `${user.name} requested to become an instructor.`,
      req.ip,
      user.id,
      user.email,
    );

    return { message: 'Request sent successfully.' };
  } catch (error) {
    throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
  }
}


  @Post(':userId/approve-instructor')
  async approveInstructor(@Param('userId') userId: string) {
    if (!userId) {
      throw new HttpException('User ID is missing', HttpStatus.BAD_REQUEST);
    }

    const user = await this.usersService.getUserById(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // Update user's role
    await this.usersService.updateUser(userId, { role: 'instructor' });

    // Log the approval
    await this.logsService.createLog(
      'instructor_request',
      `User ${user.name} was approved as an instructor.`,
      '',
      userId,
      user.email,
    );

    return { message: 'User promoted to instructor successfully.' };
  }


  @Delete(':userId/reject-instructor')
  async rejectInstructor(@Param('userId') userId: string) {
    // Log the rejection
    await this.logsService.createLog(
      'instructor_request',
      `Instructor request from user with ID ${userId} was rejected.`,
      '',
      userId,
    );

    return { message: 'Instructor request rejected successfully.' };
  }
}
  

