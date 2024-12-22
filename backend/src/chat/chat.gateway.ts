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
    const userId = client.handshake.query.userId as string;
    if (!userId) {
      console.error(`User ID is missing in the handshake for client: ${client.id}`);
      client.disconnect();
      return;
    }

    client.data.userId = userId; // Attach userId to the socket instance
    console.log(`Client connected: ${client.id}, User ID: ${userId}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    client: Socket,
    data: { senderName: string; receiverId?: string; courseId?: string; message: string },
  ) {
    const senderId = client.data.userId;
    if (!senderId) {
      console.error('Error: senderId is missing from client data.');
      return;
    }

    const messageData = { ...data, senderId };
    console.log('Saving message with data:', messageData);

    const savedMessage = await this.chatService.saveMessage(messageData);
    this.server.emit(`receiveMessage:${data.receiverId || data.courseId}`, savedMessage);
  }

  @SubscribeMessage('fetchMessages')
  async handleFetchMessages(
    @MessageBody() data: { userId: string; courseId?: string; receiverId?: string },
  ) {
    console.log('Fetching messages for:', data);

    const messages = await this.chatService.getMessagesByContext(
      data.userId,
      data.courseId,
      data.receiverId,
    );
    const channel = data.courseId
      ? `userMessages:${data.courseId}`
      : `userMessages:${data.receiverId}`;
    this.server.emit(channel, messages);
  }
}
