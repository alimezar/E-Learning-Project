import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Users } from '../users/users.schema';
import { Course } from '../courses/courses.schema';

export type NoteDocument = Notes & Document;

@Schema({ timestamps: true })
export class Notes {
  @Prop({ type: Types.ObjectId, ref: 'Users', required: true }) 
  user_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Course', required: true }) 
  course_id: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  last_updated: Date;
}

export const NoteSchema = SchemaFactory.createForClass(Notes);
