import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProgressDocument = Progress & Document;

@Schema({ timestamps: true })
export class Progress {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  courseId: string;

  @Prop({ required: true, min: 0, max: 100 })
  completionPercentage: number;

  @Prop()
  lastAccessed: Date;
}

export const ProgressSchema = SchemaFactory.createForClass(Progress);
