import { CoursesService } from './courses.service';
import { Course } from './courses.schema';
export declare class CoursesController {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
    createCourse(courseData: Partial<Course>): Promise<Course>;
    getAllCourses(): Promise<Course[]>;
    getCourse(id: string): Promise<Course>;
    updateCourse(id: string, updateData: Partial<Course>): Promise<Course>;
    deleteCourse(id: string): Promise<void>;
}
