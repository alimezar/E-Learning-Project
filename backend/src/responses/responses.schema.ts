import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ResponseDocument = Response & Document;

@Schema({ timestamps: { createdAt: 'submittedAt', updatedAt: false } })
export class Response {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  quizId: string;

  @Prop([{ 
    questionId: { type: String, required: true }, 
    answer: { type: String, required: true } 
  }])
  answers: { questionId: string; answer: string }[];

  @Prop()
  score?: number;
}

export const ResponseSchema = SchemaFactory.createForClass(Response);
