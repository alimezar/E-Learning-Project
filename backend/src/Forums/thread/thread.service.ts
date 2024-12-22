import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Thread } from './thread.schema';
import { NotificationService } from '../../notifications/notifications.service'; // Import NotificationService
import { Users } from '../../users/users.schema';  // Import Users schema

@Injectable()
export class ThreadService {
  constructor(
    @InjectModel('Thread') private threadModel: Model<Thread>,
    @InjectModel('Users') private usersModel: Model<Users>, // Inject Users model
    private notificationService: NotificationService, // Inject NotificationService
  ) {}

  async createThread(title: string, content: string, courseId: string, userId: string) {
    // Fetch the user's details
    const user = await this.usersModel.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    // Check if the user is not a student
    const isStudent = user.role === 'student';

    const thread = new this.threadModel({
      title,
      content,
      courseId,
      userId,
      userName: user.name, // Add userName dynamically from the Users collection
    });

    const savedThread = await thread.save();

    if (isStudent) {
      // Notify only the user who created the thread
      await this.notificationService.createNotification(
        userId,
        `Your thread "${title}" has been created successfully!`,
      );
    } else {
      // Convert courseId to ObjectId
      const objectIdCourseId = new Types.ObjectId(courseId);

      // Notify all students enrolled in the course
      const students = await this.usersModel
        .find({ role: 'student', enrolledCourses: objectIdCourseId })
        .exec();

      if (students.length === 0) {
        console.log(`No students found for course ID: ${courseId}`);
      }

      await Promise.all(
        students.map((student) =>
          this.notificationService.createNotification(
            student._id.toString(), // Convert ObjectId to string
            `A new thread "${title}" has been posted by ${user.name} in your course.`,
          ),
        ),
      );
    }

    return savedThread;
  }

  async getAllThreads(courseId: string) {
    return this.threadModel
      .find({ courseId })
      .populate('userId', 'name')  // Populate the user's name from the Users collection
      .exec();
  }

  async getThreadById(id: string) {
    return this.threadModel
      .findById(id)
      .populate('userId', 'name')  // Populate the user's name from the Users collection
      .exec();
  }
}
