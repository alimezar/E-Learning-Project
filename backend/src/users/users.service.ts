import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users, UserDocument } from './users.schema'; 
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-users.dto';
import { Course, CourseDocument } from '../courses/courses.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('Users') private readonly userModel: Model<UserDocument>,
    @InjectModel(Course.name) private readonly courseModel: Model<CourseDocument>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<Users> {
    const { password, ...rest } = createUserDto;
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({ ...rest, passwordHash });
    return await newUser.save();
  }

  async getUsers(): Promise<Users[]> {
    return this.userModel.find().exec();
  }

  async getUserByEmail(email: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ email }).exec();
  }

  async getUserById(userId: string): Promise<Users> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;
  }

  async updateUser(userId: string, updateData: Partial<Users>): Promise<Users> {
    const updatedUser = await this.userModel.findByIdAndUpdate(userId, updateData, { new: true }).exec();
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return updatedUser;
  }

  async deleteUser(userId: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(userId).exec();
    if (!result) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
  }

  // Enroll a user in a course
  async enrollUser(userId: string, courseId: string): Promise<Users> {
    // Ensure IDs are properly cast to ObjectId
    const userObjectId = new Types.ObjectId(userId);
    const courseObjectId = new Types.ObjectId(courseId);

    const user = await this.userModel.findById(userObjectId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const course = await this.courseModel.findById(courseObjectId);
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    // Check if user is already enrolled
    if (user.enrolledCourses.includes(courseObjectId)) {
      throw new BadRequestException(`You are already enrolled in this course!`);
    }

    user.enrolledCourses.push(courseObjectId);
    return await user.save();
  }

  async enrollInstructor(userId: string, courseId: string): Promise<Users> {
    // Ensure IDs are properly cast to ObjectId
    const userObjectId = new Types.ObjectId(userId);
    const courseObjectId = new Types.ObjectId(courseId);

    const user = await this.userModel.findById(userObjectId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const course = await this.courseModel.findById(courseObjectId);
    if (!course) {
      throw new NotFoundException(`Course with ID ${courseId} not found`);
    }

    // Check if user is already enrolled
    if (user.coursesTaught.includes(courseObjectId)) {
      throw new BadRequestException(`You are already Teaching this Course!`);
    }

    user.coursesTaught.push(courseObjectId);
    return await user.save();
  }

  async getEnrolledCourses(userId: string): Promise<Course[]> {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
  
    // Fetch all enrolled courses for the user
    const enrolledCourses = await this.courseModel.find({ _id: { $in: user.enrolledCourses } }).exec();
  
    // Filter out unavailable courses
    return enrolledCourses.filter((course) => !course.unavailable);
  }
  
  
}