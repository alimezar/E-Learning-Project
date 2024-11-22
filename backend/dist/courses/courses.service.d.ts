import { Model } from 'mongoose';
import { Course, CourseDocument } from './courses.schema';
export declare class CoursesService {
    private readonly courseModel;
    constructor(courseModel: Model<CourseDocument>);
    createCourse(courseData: Partial<Course>): Promise<Course>;
    getAllCourses(): Promise<Course[]>;
    getCourseById(id: string): Promise<Course>;
    updateCourse(id: string, updateData: Partial<Course>): Promise<Course>;
    deleteCourse(id: string): Promise<void>;
}
