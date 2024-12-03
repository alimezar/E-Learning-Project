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

@WebSocketGateway({ cors: {     origin: "*",  // Or your frontend URL
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"], credentials: true } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly chatService: ChatService) {  console.log('ChatGateway initialized');}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }a

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { senderId: string; receiverId: string; message: string },
  ) {
    const savedMessage = await this.chatService.saveMessage(data);
    this.server.emit('receiveMessage', savedMessage); // Broadcast the saved message
  }
  
  @SubscribeMessage('fetchMessages')
  async handleFetchMessages(@MessageBody() userId: string) {
    const userMessages = await this.chatService.getUserMessages(userId);
    this.server.emit('userMessages', userMessages); // Send the messages to the client
  }

}
