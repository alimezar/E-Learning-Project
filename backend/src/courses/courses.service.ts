import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
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
    const { createdById, title, description, category, difficultyLevel, modules } = courseData;
  
    // Basic validation of mandatory fields
    if (!title || !description || !category || !difficultyLevel) {
      throw new BadRequestException(
        'Missing required fields: title, description, category, or difficultyLevel.',
      );
    }
  
    // Validate instructor ID and ensure it's an ObjectId
    let instructorName: string | undefined = undefined;
    if (createdById) {
      if (!mongoose.Types.ObjectId.isValid(createdById)) {
        throw new BadRequestException('Invalid instructor ID format.');
      }
  
      const instructor = await this.userModel.findOne({
        _id: createdById,
        role: 'instructor',
      });
      if (!instructor) {
        throw new BadRequestException('Invalid instructor ID or user is not an instructor.');
      }
  
      instructorName = instructor.name; // Retrieve instructor's name
    }
  
    // Validate module IDs if provided
    if (modules && modules.length > 0) {
      await this.validateModuleIds(modules as Types.ObjectId[]);
    }
  
    // Build the course data to be created
    const courseToCreate = {
      ...courseData,
      createdBy: instructorName ?? courseData.createdBy ?? '', // Use instructor's name or fallback
      createdById: createdById ? new mongoose.Types.ObjectId(createdById) : undefined, // Ensure ObjectId
      modules: courseData.modules || [],
      multimediaResources: courseData.multimediaResources || [],
      versions: courseData.versions || [],
    };
  
    // Create and save the course
    const newCourse = new this.courseModel(courseToCreate);
    const savedCourse = await newCourse.save();
  
    // Update the instructor's coursesTaught array
    if (createdById) {
      await this.userModel.findByIdAndUpdate(
        createdById,
        { $addToSet: { coursesTaught: savedCourse._id } }, // Add course ID to coursesTaught array
        { new: true } // Return updated document (optional, for debugging)
      );
    }
  
    return savedCourse;
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
    console.log(`\nStarting update for course ID: ${id} with data:`, updateData);

    // 1) Fetch the existing course
    const existingCourse = await this.courseModel.findById(id).exec();
    if (!existingCourse) {
      console.error(`Course with ID ${id} not found.`);
      throw new NotFoundException(`Course with ID ${id} not found.`);
    }

    // 2) Debug: Show some info about the existing doc
    console.log('Existing course fetched:', {
      title: existingCourse.title,
      description: existingCourse.description,
      category: existingCourse.category,
      difficultyLevel: existingCourse.difficultyLevel,
      updatedAt: existingCourse.updatedAt,
      modules: existingCourse.modules,
      versionsCount: existingCourse.versions.length,
    });

    // 3) Prepare the "previous version" snapshot
    const previousVersion = {
      title: existingCourse.title,
      description: existingCourse.description,
      category: existingCourse.category,
      difficultyLevel: existingCourse.difficultyLevel,
      modules: existingCourse.modules,
      multimediaResources: existingCourse.multimediaResources,
      updatedAt: existingCourse.updatedAt,
    };
    console.log('Prepared previous version snapshot:', previousVersion);

    // 4) Modules validation if needed
    if (updateData.modules && Array.isArray(updateData.modules)) {
      console.log('Validating and converting module IDs for new update:', updateData.modules);
      try {
        const moduleIds = updateData.modules.map(
          (moduleId) => new mongoose.Types.ObjectId(moduleId),
        );
        await this.validateModuleIds(moduleIds);
        updateData.modules = moduleIds as any;
        console.log('Module IDs validated and converted:', updateData.modules);
      } catch (error) {
        console.error('Error validating module IDs:', error);
        throw new Error('Invalid module IDs provided.');
      }
    }

    // 5) Remove "versions" from the incoming update to avoid conflicts:
    //    This ensures we only push a new version ourselves and do not overwrite.
    if ('versions' in updateData) {
      console.warn(
        'Incoming data contains "versions". Removing it to prevent conflicts.',
      );
      delete updateData.versions;
    }

    // 6) Unify the $push and the "update" in a single atomic operation
    try {
      const updatedCourse = await this.courseModel.findByIdAndUpdate(
        id,
        {
          // push the old version
          $push: { versions: previousVersion },

          // set the new fields
          $set: {
            // We spread only the fields from updateData, ignoring versions
            ...updateData,
          },
        },
        { new: true }, // return the updated doc
      );
      if (!updatedCourse) {
        console.error(`Failed to find updated course after update for ID: ${id}`);
        throw new NotFoundException(`Failed to update course with ID ${id}.`);
      }

      console.log('Successfully updated course:', {
        _id: updatedCourse._id,
        title: updatedCourse.title,
        description: updatedCourse.description,
        versionsCount: updatedCourse.versions.length,
      });
      return updatedCourse;
    } catch (error) {
      console.error(`Error during updateCourse for course ID: ${id}`, error);
      throw new InternalServerErrorException(
        `Failed to update course with ID: ${id} - ${error.message}`,
      );
    }
  }
  
  
  async getStudentsForCourse(courseId: string): Promise<Users[]> {
    const courseObjectId = new mongoose.Types.ObjectId(courseId);
  
    return this.userModel.find({ enrolledCourses: courseObjectId }, 'name email').exec();
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

async markCourseUnavailable(courseId: string): Promise<void> {
  const course = await this.courseModel.findById(courseId);
  if (!course) {
    throw new NotFoundException('Course not found.');
  }

  // Mark the course as unavailable
  course.unavailable = true;
  await course.save();
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
// Get courses taught by a specific instructor
async getTaughtCourses(instructorId: string): Promise<Course[]> {
  console.log('Service: Fetching taught courses for instructor', instructorId);

  // Validate instructor ID
  if (!mongoose.Types.ObjectId.isValid(instructorId)) {
    console.error('Invalid instructor ID:', instructorId);
    throw new BadRequestException('Invalid instructor ID format.');
  }

  // Fetch instructor document
  const instructor = await this.userModel.findById(instructorId).exec();
  if (!instructor) {
    console.error('Instructor not found:', instructorId);
    throw new NotFoundException('Instructor not found.');
  }

  // Fetch courses based on the `coursesTaught` array
  const courses = await this.courseModel.find({ _id: { $in: instructor.coursesTaught } }).exec();
  console.log('Courses fetched:', courses);

  return courses;
}





// Get courses without an assigned instructor
async getTeachableCourses(): Promise<Course[]> {
  return this.courseModel.find({
    $or: [
      { createdById: { $exists: false } },
      { createdById: null },
    ],
  }).exec();
}

// Assign a course to an instructor
async assignCourse(courseId: string, instructorId: string): Promise<Course> {
  console.log('Service: Assigning course to instructor', { courseId, instructorId });

  // Validate `instructorId`
  if (!mongoose.Types.ObjectId.isValid(instructorId)) {
    console.error('Invalid instructor ID:', instructorId);
    throw new BadRequestException('Invalid instructor ID format.');
  }

  // Fetch the instructor
  const instructor = await this.userModel.findById(instructorId).exec();
  if (!instructor) {
    console.error('Instructor not found:', instructorId);
    throw new NotFoundException('Instructor not found.');
  }

  if (instructor.role !== 'instructor') {
    console.error('User is not an instructor:', instructorId);
    throw new BadRequestException('User is not an instructor.');
  }

  // Fetch the course
  const course = await this.courseModel.findById(courseId).exec();
  if (!course) {
    console.error('Course not found:', courseId);
    throw new NotFoundException('Course not found.');
  }

  // Check if the course is already assigned
  if (course.createdById) {
    console.error('Course is already assigned:', courseId);
    throw new BadRequestException('This course is already assigned to an instructor.');
  }

  // Assign the course to the instructor
  course.createdBy = instructor.name;
  course.createdById = instructor._id;

  // Save the updated course
  await course.save();

  // Update the instructor's `coursesTaught` array
  const updatedInstructor = await this.userModel
    .findByIdAndUpdate(
      instructorId,
      { $addToSet: { coursesTaught: course._id } }, // Add the course ID to the array if not already present
      { new: true } // Return the updated instructor document
    )
    .exec();

  if (!updatedInstructor) {
    console.error('Failed to update instructor coursesTaught:', instructorId);
    throw new InternalServerErrorException('Failed to update instructor coursesTaught.');
  }

  console.log('Course successfully assigned:', {
    courseId,
    instructorId: instructor._id,
    instructorName: instructor.name,
  });

  return course;
}

async getCourseVersions(courseId: string): Promise<any[]> {
  const course = await this.courseModel.findById(courseId).exec();

  if (!course) {
    throw new NotFoundException('Course not found.');
  }

  return course.versions;
}

}
