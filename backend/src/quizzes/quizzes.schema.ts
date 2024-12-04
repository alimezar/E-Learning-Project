import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type QuizDocument = Quizzes & Document;

@Schema()
export class Quizzes {
  @Prop({ type: Types.ObjectId, ref: 'Module', required: true }) 
  moduleId: Types.ObjectId;

  @Prop({ type: [Object], required: true })
  questions: Record<string, any>[];
  
}

export const QuizSchema = SchemaFactory.createForClass(Quizzes);
