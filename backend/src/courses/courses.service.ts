import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Course, CourseDocument } from './courses.schema';
import { Users, UserDocument } from 'src/users/users.schema';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name) private readonly courseModel: Model<CourseDocument>,
    @InjectModel(Users.name) private readonly userModel: Model<UserDocument>,

  ) {}

  // Create a new course
  // async createCourse(courseData: any): Promise<Course> {
  //   // Validate `createdBy` is a valid MongoDB ObjectId
  //   const instructor = await this.userModel.findOne({
  //     _id: courseData.createdBy,
  //     role: 'instructor',
  //   });

  //   if (!instructor) {
  //     throw new BadRequestException('Invalid instructor ID or not an instructor');
  //   }

  //   // Proceed with course creation
  //   return this.courseModel.create(courseData);
  // }

  async createCourse(courseData: Partial<Course>): Promise<Course> {
    const { createdBy, title, description, category, difficultyLevel } = courseData;
  
    // Validate required fields
    if (!createdBy || !title || !description || !category || !difficultyLevel) {
      throw new BadRequestException('Missing required fields: createdBy, title, description, category, or difficultyLevel.');
    }
  
    // Validate `createdBy` is a valid MongoDB ObjectId and belongs to an instructor
    const instructor = await this.userModel.findOne({
      _id: createdBy,
      role: 'instructor',
    });
  
    if (!instructor) {
      throw new BadRequestException('Invalid instructor ID or user is not an instructor.');
    }
  
    // Initialize optional fields if not provided
    const courseToCreate = {
      ...courseData,
      createdBy: instructor.name,
      modules: courseData.modules || [],
      multimediaResources: courseData.multimediaResources || [],
      versions: courseData.versions || [],
    };
  
    // Create and save the course
    const newCourse = new this.courseModel(courseToCreate);
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

  async searchCourses(query: string): Promise<Course[]> {
    return this.courseModel
      .find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { category: { $regex: query, $options: 'i' } },
        ],
      })
      .exec();
  }

async updateCourseWithVersion(id: string, updateData: Partial<Course>): Promise<Course> {
  const existingCourse = await this.courseModel.findById(id).exec();
  if (!existingCourse) throw new Error('Course not found.');

  const newVersion = { ...existingCourse.toObject() };
  await this.courseModel.findByIdAndUpdate(
    id,
    { $push: { versions: newVersion }, ...updateData },
    { new: true },
  ).exec();
  return existingCourse;
}
async searchStudentInCourse(courseId: string, email: string): Promise<Users[]> {
  // Convert courseId to ObjectId
  const courseObjectId = new mongoose.Types.ObjectId(courseId);

  // Find students based on courseId (as ObjectId) and email
  const students = await this.userModel
    .find({
      role: 'student',
      enrolledCourses: courseObjectId,  // Ensure this is ObjectId
      email: { $regex: email, $options: 'i' },  // Case-insensitive search for email
    })
    .exec();
  return students;
}

async searchInstructorInCourse(courseId: string, email: string): Promise<Users[]> {
  // Convert courseId to ObjectId
  const courseObjectId = new mongoose.Types.ObjectId(courseId);

  const courseExists = await this.courseModel.exists({ _id: courseObjectId });
    if (!courseExists) {
      throw new NotFoundException('Course not found'); // Throw error if course is not found
    }

  // Find instructors based on courseId (as ObjectId) and email
  const instructors = await this.userModel
    .find({
      role: 'instructor', // Only search for instructors
      coursesTaught: courseObjectId, // Ensure this is ObjectId
      email: { $regex: email, $options: 'i' },  // Case-insensitive search for email
    })
    .exec();

  return instructors;
}
}
