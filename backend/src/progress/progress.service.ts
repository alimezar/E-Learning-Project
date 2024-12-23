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

  async getAllProgressForUser(userId: string): Promise<Progress[]> {
    const userObjectId = new Types.ObjectId(userId); // Ensure userId is an ObjectId
  
    const progresses = await this.progressModel
      .find({ userId: userObjectId }) // Match userId as ObjectId
      .populate('courseId') // Populate course details
      .exec();
  
    // Debugging logs
    console.log(`Progresses for user ${userId}:`, progresses);
  
    return progresses;
  }
  
  
  // New method: Get all progresses for all students grouped by course
  async getAllProgresses(): Promise<any[]> {
    return this.progressModel
      .aggregate([
        {
          $lookup: {
            from: 'users', // Match the name of the Users collection
            localField: 'userId',
            foreignField: '_id',
            as: 'userInfo',
          },
        },
        {
          $lookup: {
            from: 'courses', // Match the name of the Courses collection
            localField: 'courseId',
            foreignField: '_id',
            as: 'courseInfo',
          },
        },
        {
          $project: {
            _id: 1,
            userId: 1,
            courseId: 1,
            completedPercentage: 1,
            completedCourses: 1,
            last_accessed: 1,
            averageScore: 1,
            userInfo: { $arrayElemAt: ['$userInfo', 0] }, // Get the first user record
            courseInfo: { $arrayElemAt: ['$courseInfo', 0] }, // Get the first course record
          },
        },
      ])
      .exec();
  }

  //=============================================== INSTRUCTOR PROGRESS ===============================================
  async getStudentProgressByCourse(courseId: string) {
    const course = await this.courseModel.findById(courseId).exec();
    if (!course) {
      throw new NotFoundException('Course not found');
    }
  
    const student = await this.userModel
      .findOne({ role: 'student', enrolledCourses: courseId })
      .exec();
    if (!student) {
      throw new NotFoundException('Student for this course not found');
    }
  
    const progress = await this.progressModel
      .findOne({ userId: student._id, courseId })
      .exec();
    if (!progress) {
      throw new NotFoundException('Progress not found for this student in the course');
    }
  
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
