import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type QuizDocument = Quizzes & Document;

@Schema()
export class Quizzes {
  @Prop({ type: Types.ObjectId, ref: 'Users', required: true }) 
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Module', required: true }) 
  moduleId: Types.ObjectId;

  @Prop({type: Number})
  size: number;

  @Prop({ type: String, default: "both", enum: ["mcq", "trueFalse", "both"]})
  type: string

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Questions'}], required: true })
  questions: Types.ObjectId[];
  
}

export const QuizSchema = SchemaFactory.createForClass(Quizzes);
