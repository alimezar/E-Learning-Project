import { Schema, Document } from 'mongoose';

export interface Notification extends Document {
  userId: Schema.Types.ObjectId; // Use ObjectId type for user reference
  message: string;
  read: boolean;
  createdAt: Date;
}

export const NotificationSchema = new Schema<Notification>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to 'User' model
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});
