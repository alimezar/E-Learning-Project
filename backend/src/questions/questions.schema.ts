import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type QuestionDocument = Questions & Document;

@Schema()
export class Questions {
  @Prop({ type: Types.ObjectId, ref: 'Module', required: true }) 
  moduleId: Types.ObjectId;

  @Prop({ type: String, required: true })
  difficulty: string;

  @Prop({ type: String, required: true })
  question: string;

  @Prop({ type: [String], required: true, validate: (arr) => arr.length === 2  /* this is to assure that the options array has 2 values only*/ })
  options: string[];

  @Prop({ type: String, required: true })
  answer: string;
}

export const QuestionSchema = SchemaFactory.createForClass(Questions);