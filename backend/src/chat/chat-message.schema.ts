import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ChatMessage extends Document {
  @Prop({ required: true })
  senderId: string;

  @Prop({ required: true })
  senderName: string;

  @Prop({ required: false })
  courseId?: string; // Include courseId for group chat messages

  @Prop({ required: false })
  receiverId?: string; // Add receiverId for 1-on-1 messages

  @Prop({ required: true })
  message: string;

  @Prop({ default: Date.now })
  timestamp: Date;

  @Prop({ required: false })
link?: string; // Optional link field for redirection

}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
