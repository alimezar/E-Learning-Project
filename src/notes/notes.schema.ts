import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type NoteDocument = Notes & Document;

@Schema()
export class Notes {
  @Prop({ required: true })
  module_id: string;

  @Prop({ type: [Object], required: true })
  questions: Record<string, any>[];

  @Prop({ required: true })
  user_id: string;

  @Prop()
  course_id?: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  last_updated: Date;

  constructor() {
    this.module_id = '';
    this.questions = [];
    this.user_id = '';
    this.content = '';
    this.created_at = new Date();
    this.last_updated = new Date();
  }
}

export const NoteSchema = SchemaFactory.createForClass(Notes);
