import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatMessage } from './chat-message.schema';
import { NotificationService } from '../notifications/notifications.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(ChatMessage.name) private chatMessageModel: Model<ChatMessage>,
    private notificationService: NotificationService, // Inject NotificationService
  ) {}

  // Save a chat message to the database and send a notification
  async saveMessage(data: { senderId: string; senderName: string; receiverId?: string; courseId?: string; message: string }) {
    console.log('Saving message data:', data); // Debugging log
    if (!data.senderId) {
      throw new Error('Missing senderId'); // Explicit error for debugging
    }

    const newMessage = new this.chatMessageModel(data);
    const savedMessage = await newMessage.save();

    // Create a notification for the receiver if it's a 1-on-1 chat
    if (data.receiverId) {
      await this.notificationService.createNotification(
        data.receiverId, // Receiver's ID
        `New message from ${data.senderName}`, // Notification message
        `/chat/${data.senderId}` // Link to the chat page
      );
    }

    return savedMessage;
  }

  // Fetch messages by courseId, userId, or receiverId
async getMessagesByContext(courseId: string) {
  if (!courseId) {
    throw new Error('Course ID is required to fetch messages.');
  }

  console.log('Fetching messages for courseId:', courseId);

  const filter = { courseId }; // Fetch messages only by courseId
  console.log('Query filter:', filter);

  return this.chatMessageModel.find(filter).sort({ timestamp: 1 }).exec(); // Sorted by timestamp ascending
}
      }
