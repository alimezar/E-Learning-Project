import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Quizzes } from '../quizzes/quizzes.schema';
import { Users } from '../users/users.schema';

export type ResponseDocument = Response & Document;

@Schema({ timestamps: { createdAt: 'submittedAt', updatedAt: false } })
export class Response {
  @Prop({ type: Types.ObjectId, ref: 'Users', required: true }) // Reference to Users schema
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Quizzes', required: true }) // Reference to Quizzes schema
  quizId: Types.ObjectId;

  @Prop([
    {
      questionId: { type: String, required: true },
      answer: { type: String, required: true },
    },
  ])
  answers: { questionId: string; answer: string }[];

  @Prop()
  score?: number;
}

export const ResponseSchema = SchemaFactory.createForClass(Response);
