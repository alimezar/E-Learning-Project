import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Progress, ProgressDocument } from './progress.schema';
import { Users } from '../users/users.schema';
import { Course } from '../courses/courses.schema';

@Injectable()
export class ProgressService {
  constructor(
    @InjectModel(Progress.name) private readonly progressModel: Model<ProgressDocument>,
    @InjectModel('Users') private readonly userModel: Model<Users>, // Inject Users model
    @InjectModel('Course') private readonly courseModel: Model<Course>, // Inject Courses model
  ) {}

  private async validateUserId(userId: Types.ObjectId): Promise<void> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new BadRequestException(`Invalid userId: "${userId}"`);
    }
  }

  private async validateCourseId(courseId: Types.ObjectId): Promise<void> {
    const course = await this.courseModel.findById(courseId).exec();
    if (!course) {
      throw new BadRequestException(`Invalid courseId: "${courseId}"`);
    }
  }

  async createProgress(userId: string, courseId: string): Promise<Progress> {
    const userObjectId = new Types.ObjectId(userId);
    const courseObjectId = new Types.ObjectId(courseId);

    await this.validateUserId(userObjectId);
    await this.validateCourseId(courseObjectId);

    const existingProgress = await this.progressModel.findOne({ userId: userObjectId, courseId: courseObjectId }).exec();
    if (existingProgress) {
      return existingProgress;
    }

    const progress = new this.progressModel({
      userId: userObjectId,
      courseId: courseObjectId,
      completedPercentage: 0,
    });

    return progress.save();
  }

  async getProgress(userId: string, courseId: string): Promise<Progress> {
    const userObjectId = new Types.ObjectId(userId);
    const courseObjectId = new Types.ObjectId(courseId);

    const progress = await this.progressModel
      .findOne({ userId: userObjectId, courseId: courseObjectId })
      .populate('userId')
      .populate('courseId')
      .exec();

    if (!progress) {
      throw new NotFoundException(`Progress for user ${userId} in course ${courseId} not found.`);
    }

    return progress;
  }

  async getAllProgress(): Promise<Progress[]> {
    return this.progressModel.find().exec();
  }

  async updateProgress(
    userId: string,
    courseId: string,
    updateData: Partial<Progress>,
  ): Promise<Progress> {
    const userObjectId = new Types.ObjectId(userId);
    const courseObjectId = new Types.ObjectId(courseId);

    const progress = await this.progressModel
      .findOneAndUpdate(
        { userId: userObjectId, courseId: courseObjectId },
        { $set: updateData },
        { new: true },
      )
      .populate('userId')
      .populate('courseId')
      .exec();

    if (!progress) {
      throw new NotFoundException(`Progress for user ${userId} in course ${courseId} not found.`);
    }

    return progress;
  }

  async completeModule(userId: string, courseId: string, moduleId: string): Promise<Progress> {
    const userObjectId = new Types.ObjectId(userId);
    const courseObjectId = new Types.ObjectId(courseId);

    const progress = await this.progressModel
      .findOneAndUpdate(
        { userId: userObjectId, courseId: courseObjectId },
        {
          $addToSet: { completedCourses: moduleId },
        },
        { new: true },
      )
      .exec();

    if (!progress) {
      throw new NotFoundException(`Progress for user ${userId} in course ${courseId} not found.`);
    }

    const totalModules = 10;
    const completedPercentage = (progress.completedCourses.length / totalModules) * 100;

    return this.progressModel
      .findOneAndUpdate(
        { userId: userObjectId, courseId: courseObjectId },
        { completedPercentage },
        { new: true },
      )
      .populate('userId')
      .populate('courseId')
      .exec();
  }

  //=============================================== INSTRUCTOR PROGRESS ===============================================
  async getStudentProgressByCourse(courseId: string) {
    // First, find the course
    const course = await this.courseModel.findById(courseId).exec();
    if (!course) {
      throw new NotFoundException('Course not found');
    }
  
    // Find the student who is enrolled in the course
    const student = await this.userModel
      .findOne({ role: 'student', enrolledCourses: courseId })
      .exec();
    if (!student) {
      throw new NotFoundException('Student for this course not found');
    }
  
    // Now, find the progress for the student in this course
    const progress = await this.progressModel
      .findOne({ userId: student._id, courseId })
      .exec();
    if (!progress) {
      throw new NotFoundException('Progress not found for this student in the course');
    }
  
    // Return student progress details
    return {
      studentId: student._id,
      studentName: student.name,
      courseName: course.title,
      completedModules: progress.completedCourses,
      progressPercentage: progress.completedPercentage,
      lastAccessed: progress.last_accessed,
      averageScore: progress.averageScore,
    };
  }
  
}
