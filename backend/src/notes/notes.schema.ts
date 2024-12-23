import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Users } from '../users/users.schema';
import { Course } from '../courses/courses.schema';
import { Module } from '../modules/modules.schema';

export type NoteDocument = Notes & Document;

@Schema({ timestamps: true })
export class Notes {
  @Prop({ type: Types.ObjectId, ref: 'Users', required: true })
  user_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Module', required: true })
  module_id: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ default: Date.now })
  last_updated: Date;
}

export const NoteSchema = SchemaFactory.createForClass(Notes);
