import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Users } from '../../users/users.schema';
import { Course } from '../../courses/courses.schema';

export type ThreadDocument = Thread & Document;

@Schema({ timestamps: true })
export class Thread {
  @Prop({ required: true }) // Title of the thread
  title: string;

  @Prop({ required: true }) // Content of the thread
  content: string;

  @Prop({ type: Types.ObjectId, ref: 'Course', required: true }) // Reference to Course schema
  courseId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Users', required: true }) // Reference to Users schema
  userId: Types.ObjectId;

  @Prop({ required: true })  // Store the username along with the thread
  userName: string;
  
  @Prop({ default: () => new Date() }) // Automatically set creation date
  createdAt: Date;

  @Prop({ default: () => new Date() }) // Automatically set update date
  updatedAt: Date;
}

export const ThreadSchema = SchemaFactory.createForClass(Thread);
