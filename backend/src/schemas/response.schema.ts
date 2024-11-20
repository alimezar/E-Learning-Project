import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ResponseDocument = Response & Document;

@Schema({ timestamps: true })
export class Response {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  quizId: string;

  @Prop({ type: Array, required: true })
  answers: Record<string, any>[]; // User's answers

  @Prop({ required: true })
  score: number;
}

export const ResponseSchema = SchemaFactory.createForClass(Response);
