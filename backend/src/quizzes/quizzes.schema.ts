import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QuizDocument = Quizzes & Document;

@Schema()
export class Quizzes {
  @Prop({ required: true })
  module_id: string;

  @Prop({ type: [Object], required: true })
  questions: Record<string, any>[];
}

export const QuizSchema = SchemaFactory.createForClass(Quizzes);
