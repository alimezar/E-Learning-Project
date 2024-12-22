import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatMessage } from './chat-message.schema';

@Injectable()
export class ChatService {
  constructor(@InjectModel(ChatMessage.name) private chatMessageModel: Model<ChatMessage>) {}

  // Save a chat message to the database
  async saveMessage(data: { senderId: string; senderName: string; courseId?: string; message: string }) {
    console.log('Saving message:', data);
    const newMessage = new this.chatMessageModel(data);
    return newMessage.save();
  }

  // Fetch messages by course ID or user context
  async getMessagesByContext(userId: string, courseId?: string) {
    const filter = courseId
      ? { courseId } // Messages related to a course
      : { $or: [{ senderId: userId }, { receiverId: userId }] }; // 1-on-1 messages

    return this.chatMessageModel.find(filter).sort({ timestamp: 1 }).exec(); // Sorted by timestamp ascending
  }
}
