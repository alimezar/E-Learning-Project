import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatMessage } from './chat-message.schema';

@Injectable()
export class ChatService {
  constructor(@InjectModel(ChatMessage.name) private chatMessageModel: Model<ChatMessage>) {}

  async saveMessage(data: { senderId: string; senderName: string; courseId?: string; message: string }) {
    console.log('Saving message:', data); // Debug data before saving
    const newMessage = new this.chatMessageModel(data);
    return newMessage.save(); // Save to MongoDB
  }
  
  async getMessagesByCourse(userId: string, courseId: string) {
    return this.chatMessageModel
      .find({ courseId, $or: [{ senderId: userId }, { receiverId: userId }] })
      .sort({ timestamp: -1 })
      .exec(); // Fetch user-specific messages for a course
  }

  async getMessagesByContext(userId: string, courseId?: string) {
    const filter = courseId
      ? { courseId } // Fetch messages for the course
      : { $or: [{ senderId: userId }, { receiverId: userId }] }; // Fetch 1-on-1 messages
  
    return this.chatMessageModel.find(filter).sort({ timestamp: -1 }).exec();
  }
    
}
