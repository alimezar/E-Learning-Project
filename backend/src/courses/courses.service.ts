import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { Course, CourseDocument } from './courses.schema';
import { Users, UserDocument } from 'src/users/users.schema';
import { Module, ModuleDocument } from '../modules/modules.schema'; // Import Module schema


@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name) private readonly courseModel: Model<CourseDocument>,
    @InjectModel(Users.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Module.name) private readonly moduleModel: Model<ModuleDocument>, // Inject Module model

  ) {}

  private async validateModuleIds(moduleIds: Types.ObjectId[]): Promise<void> {
    for (const id of moduleIds) {
      const moduleExists = await this.moduleModel.findById(id);
      if (!moduleExists) {
        throw new BadRequestException(`Invalid module ID: "${id}"`);
      }
    }
  }


  async createCourse(courseData: Partial<Course>): Promise<Course> {
    const { createdBy, title, description, category, difficultyLevel, modules } = courseData;
  
    // Validate required fields
    if (!createdBy || !title || !description || !category || !difficultyLevel) {
      throw new BadRequestException('Missing required fields: createdBy, title, description, category, or difficultyLevel.');
    }
  
    // Validate `createdBy` is a valid MongoDB ObjectId and belongs to an instructor
    const instructor = await this.userModel.findOne({
      _id: createdBy,
      role: 'instructor',
    });
    
    if (modules && modules.length > 0) {
      await this.validateModuleIds(modules as Types.ObjectId[]);
    }

  
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
 
// Get Course MultiMedia Resources
async getMultiMediaResources(courseId: string): Promise<string[]> {
  const course = await this.courseModel.findById(courseId).exec();
  if (!course) {
    throw new NotFoundException('Course not found.');
  }
  return course.multimediaResources;
}

// Get Course Modules 
async getCourseModules(courseId: string): Promise<any[]> {
  const course = await this.courseModel.findById(courseId).exec();
  if (!course) {
    throw new NotFoundException('Course not found.');
  }
  return course.modules;
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

  async updateCourse(id: string, updateData: Partial<Course>): Promise<Course> {
    if (updateData.modules && Array.isArray(updateData.modules)) {
        // Convert modules to ObjectIds
        const moduleIds = updateData.modules.map((moduleId) => 
            new mongoose.Types.ObjectId(moduleId)
        );

        // Validate module IDs
        await this.validateModuleIds(moduleIds);

        // Update the modules field
        updateData.modules = moduleIds as any;
    }

    const updatedCourse = await this.courseModel
        .findByIdAndUpdate(id, updateData, { new: true })
        .exec();

    if (!updatedCourse) {
        throw new NotFoundException(`Course with ID ${id} not found.`);
    }

    return updatedCourse;
}
async getCourseModulesWithDetails(courseId: string): Promise<{ courseId: string; modules: Module[] }> {
  // Validate course existence
  const course = await this.courseModel.findById(courseId).populate('modules').exec();
  if (!course) {
    throw new NotFoundException(`Course with ID ${courseId} not found.`);
  }

  // Ensure all modules in the `modules` array are retrieved with their full details
  const modules = await this.moduleModel.find({ _id: { $in: course.modules } }).exec();

  return { courseId, modules };
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
