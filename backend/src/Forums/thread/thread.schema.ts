import { Schema, Document } from 'mongoose';

export interface Thread extends Document {
  title: string;
  content: string;
  courseId: string; // Refers to the course this thread belongs to
  userId: string; // The user who created the thread
  createdAt: Date;
  updatedAt: Date;
}

export const ThreadSchema = new Schema<Thread>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  courseId: { type: String, required: true },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
