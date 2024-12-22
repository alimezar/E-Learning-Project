import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CourseDocument = Course & Document;

@Schema({ timestamps: true })
export class Course {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true, enum: ['Beginner', 'Intermediate', 'Advanced'] })
  difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  
  @Prop({ required: false })
  createdBy?: string;

  @Prop({ type: Types.ObjectId, ref: 'Users', required: false })
  createdById?: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Module' }] })
  modules: Types.ObjectId[]; 

  @Prop({ type: [String], default: [] })
  multimediaResources: string[]; // Array of URLs for videos, PDFs, etc.

  @Prop({ type: [Object], default: [] })
  versions: Record<string, any>[]; 

  @Prop({ type: Boolean, default: false })
  unavailable: boolean;

  @Prop({ type: Date })
  updatedAt?: Date;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
