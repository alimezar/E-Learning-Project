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

  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) 
  createdBy: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Module' }] })
  modules: Types.ObjectId[]; // Link modules hierarchically.

  @Prop({ type: [String], default: [] })
  multimediaResources: string[]; // Array of URLs for videos, PDFs, etc.

  @Prop({ type: [Object], default: [] })
  versions: Record<string, any>[]; // Store versioned course content.
}

export const CourseSchema = SchemaFactory.createForClass(Course);
