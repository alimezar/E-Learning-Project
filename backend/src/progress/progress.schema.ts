import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Users } from '../users/users.schema';
import { Course } from '../courses/courses.schema';

export type ProgressDocument = Progress & Document;

@Schema({ timestamps: true })
export class Progress {
  @Prop({ type: Types.ObjectId, ref: 'Users', required: true }) // Reference to Users schema
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Course', required: true }) // Reference to Courses schema
  courseId: Types.ObjectId;

  @Prop({ required: true, default: 0 })
  completedPercentage: number;

  @Prop({ type: [String], default: [] }) // Could also be CompletedModules not sure..
  completedCourses: string[];

  @Prop({ required: true, default: () => new Date() })
  last_accessed: Date;
 
  @Prop({ required: true, default: 0 })
  averageScore: number;
//average score added
}

export const ProgressSchema = SchemaFactory.createForClass(Progress);
