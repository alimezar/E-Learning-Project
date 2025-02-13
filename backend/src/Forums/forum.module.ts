import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ThreadController } from './thread/thread.controller';
import { ThreadService } from './thread/thread.service';
import { Thread, ThreadSchema } from './thread/thread.schema';
import { ReplyController } from './reply/reply.controller';
import { ReplyService } from './reply/reply.service';
import { Reply, ReplySchema } from './reply/reply.schema';
import { NotificationModule } from '../notifications/notifications.module'; // Import NotificationModule
import { UsersModule } from '../users/users.module';  // Import UsersModule

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Thread', schema: ThreadSchema },
      { name: 'Reply', schema: ReplySchema },
    ]),
    NotificationModule,  
    UsersModule,  // Import UsersModule so UsersModel is available
  ],
  controllers: [ThreadController, ReplyController],
  providers: [ThreadService, ReplyService],
})
export class ForumModule {}
