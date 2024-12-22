import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: '*', // Replace with your frontend URL if necessary
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { senderId: string; senderName: string; courseId?: string; message: string }
  ) {
    console.log('Received WebSocket message:', data);

    // Save the message to the database
    const savedMessage = await this.chatService.saveMessage(data);

    // Determine the broadcast channel
    const channel = data.courseId ? `receiveMessage:${data.courseId}` : `receiveMessage:${data.senderId}`;

    // Broadcast the message to the appropriate channel
    this.server.emit(channel, {
      senderId: savedMessage.senderId,
      senderName: savedMessage.senderName,
      courseId: savedMessage.courseId || null,
      message: savedMessage.message,
      timestamp: savedMessage.timestamp,
    });
  }

  @SubscribeMessage('fetchMessages')
  async handleFetchMessages(
    @MessageBody() data: { userId: string; courseId?: string }
  ) {
    console.log('Fetching messages for:', data);

    const messages = await this.chatService.getMessagesByContext(data.userId, data.courseId);
    const channel = data.courseId ? `userMessages:${data.courseId}` : `userMessages:${data.userId}`;
    this.server.emit(channel, messages);
  }
}
