import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type QuizDocument = Quizzes & Document;

@Schema()
export class Quizzes {
  @Prop({ type: Types.ObjectId, ref: 'Module', required: true }) 
  moduleId: Types.ObjectId;

  @Prop({
    type: [
      {
        question: { type: String, required: true },
        difficulty: { type: String, required: true },
        options: { type: [String], required: true},
        answer: { type: String, required: true },
        moduleId: { 
          type: Types.ObjectId, 
          ref: 'Module',  // Reference to the Module schema
          required: true 
        },
      },
    ],
    required: true,
  })
  questions: {
    question: string;
    difficulty: string;
    options: string[];
    answer: string;
    moduleId: Types.ObjectId; // has the id of the module
  }[];
  
}

export const QuizSchema = SchemaFactory.createForClass(Quizzes);
