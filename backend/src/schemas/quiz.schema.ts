import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QuizDocument = Quiz & Document;

@Schema({ timestamps: true })
export class Quiz {
  @Prop({ required: true })
  moduleId: string;

  @Prop({ type: Array, required: true })
  questions: Record<string, any>[]; // Question details in an array of objects
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
