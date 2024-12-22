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
    @MessageBody() data: { senderId: string; senderName: string; receiverId: string; message: string },
  ) {
    console.log('Received message data:', data); // Log the received data
  
    // Save message to database
    const savedMessage = await this.chatService.saveMessage(data);
  
    console.log('Saved message:', savedMessage); // Log the saved message
    
    // Broadcast message with senderName
    this.server.emit('receiveMessage', {
      senderId: savedMessage.senderId,
      senderName: savedMessage.senderName, // Include senderName
      receiverId: savedMessage.receiverId,
      message: savedMessage.message,
      timestamp: savedMessage.timestamp,
    });
  }
  
@SubscribeMessage('fetchMessages')
  async handleFetchMessages(@MessageBody() userId: string) {
    const userMessages = await this.chatService.getUserMessages(userId);
    this.server.emit('userMessages', userMessages); // Send the messages to the client
  }

}
