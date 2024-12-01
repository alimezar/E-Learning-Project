import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course, CourseDocument } from './courses.schema';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name) private readonly courseModel: Model<CourseDocument>,
  ) {}

  // Create a new course
  async createCourse(courseData: Partial<Course>): Promise<Course> {
    const newCourse = new this.courseModel(courseData);
    return newCourse.save();
  }

  // Get all courses
  async getAllCourses(): Promise<Course[]> {
    return this.courseModel.find().exec();
  }

  async getCoursesByUserId(userId: string): Promise<Course[]> {
    return this.courseModel.find({ enrolledUsers: userId }).exec();
  }

  // Get a single course by ID
  async getCourseById(id: string): Promise<Course> {
    return this.courseModel.findById(id).exec();
  }

  // Update a course by ID
  async updateCourse(id: string, updateData: Partial<Course>): Promise<Course> {
    return this.courseModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  // Delete a course by ID
  async deleteCourse(id: string): Promise<void> {
    await this.courseModel.findByIdAndDelete(id).exec();
  }
}
