import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProgressDocument = Progress & Document;

@Schema({ timestamps: true })
export class Progress {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  courseId: string;

  @Prop({ required: true, default: 0 })
  completedPercentage: number; 

  @Prop({ default: [] })
  completedModules: string[]; 

  @Prop({ required: true, default: () => new Date() })
  last_accessed: Date;
  @Prop({ required: true })
  progressId: string;

}

export const ProgressSchema = SchemaFactory.createForClass(Progress);
