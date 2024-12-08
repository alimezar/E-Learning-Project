import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Users } from '../users/users.schema';
import { Course } from '../courses/courses.schema';

export type ProgressDocument = Progress & Document;

@Schema({ timestamps: true })
export class Progress {
  @Prop({ type: Types.ObjectId, ref: 'Users', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  courseId: Types.ObjectId;

  @Prop({ required: true, default: 0 })
  completedPercentage: number;

  @Prop({ type: [String], default: [] }) // CompletedModules
  completedCourses: string[];

  @Prop({ required: true, default: () => new Date() })
  last_accessed: Date;

  @Prop({ default: 0 }) // This will store the score for the user in the course
  score: number;

  @Prop({ default: 0 }) // This will store the time spent on the course (in minutes)
  timeSpent: number;
}


export const ProgressSchema = SchemaFactory.createForClass(Progress);
