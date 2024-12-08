// reply.schema.ts
import { Schema, Document } from 'mongoose';

export interface Reply extends Document {
  userId: string;
  content: string;
  threadId: Schema.Types.ObjectId; // Use ObjectId for the thread reference
  createdAt: Date;
}

export const ReplySchema = new Schema<Reply>({
  userId: { type: String, required: true }, // User ID of the person who made the reply
  content: { type: String, required: true }, // Content of the reply
  threadId: { type: Schema.Types.ObjectId, ref: 'Thread', required: true }, // Reference to the Thread
  createdAt: { type: Date, default: Date.now }, // Timestamp for when the reply was created
});
