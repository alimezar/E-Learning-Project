import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type QuestionDocument = Questions & Document;

@Schema()
export class Questions {
  @Prop({ type: Types.ObjectId, ref: 'Users', required: true }) // Reference to Users schema
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Module', required: true }) 
  moduleId: Types.ObjectId;

  @Prop({ type: String, required: true })
  difficulty: string;

  @Prop({ type: String, required: true })
  type: string;

  @Prop({ type: String, required: true })
  question: string;

  @Prop({ type: [String], required: true })
  options: string[];

  @Prop({ type: String, required: true })
  answer: string;

  @Prop({ type: String, default: "" })
  choice: string;                          // this is the attribute that holds the option that the user chose 
}

export const QuestionSchema = SchemaFactory.createForClass(Questions);