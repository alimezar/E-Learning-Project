import { Document } from 'mongoose';
export type CourseDocument = Course & Document;
export declare class Course {
    title: string;
    description: string;
    category: string;
    difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced';
    createdBy: string;
}
export declare const CourseSchema: import("mongoose").Schema<Course, import("mongoose").Model<Course, any, any, any, Document<unknown, any, Course> & Course & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Course, Document<unknown, {}, import("mongoose").FlatRecord<Course>> & import("mongoose").FlatRecord<Course> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
