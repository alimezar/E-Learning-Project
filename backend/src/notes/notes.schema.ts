import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NotesDocument = Notes & Document;

@Schema({ timestamps: true })
export class Notes {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Users' })  // Reference to User schema
  user_id: Types.ObjectId;  // User who created the note

  @Prop({ required: true })
  content: string;  // The content of the note

  @Prop({ default: Date.now })
  createdAt: Date;  // Automatically set when the note is created
}

export const NotesSchema = SchemaFactory.createForClass(Notes);
