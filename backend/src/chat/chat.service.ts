import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatMessage } from "../chat/chat-message.schema";

@Injectable()
export class ChatService {
  constructor(@InjectModel(ChatMessage.name) private chatMessageModel: Model<ChatMessage>) {}

  async saveMessage(data: { senderId: string; receiverId: string; message: string }) {
    const newMessage = new this.chatMessageModel(data);
    return newMessage.save(); // Save to MongoDB
  }

  async getMessages() {
    return this.chatMessageModel.find().sort({ timestamp: -1 }).exec(); // Fetch messages
  }

  async getUserMessages(userId: string) {
    return this.chatMessageModel
      .find({ $or: [{ senderId: userId }, { receiverId: userId }] })
      .sort({ timestamp: -1 })
      .exec(); // Fetch user-specific messages
  }
}
