import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Thread } from '../thread/thread.schema';

export type ReplyDocument = Reply & Document;

@Schema({ timestamps: true })
export class Reply {
  @Prop({ type: Types.ObjectId, ref: 'Thread', required: true }) // Reference to Thread schema
  threadId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Users', required: true }) // Reference to Users schema
  userId: Types.ObjectId;

  @Prop({ required: true }) // Store the username along with the reply
  userName: string;

  @Prop({ required: true }) // Content of the reply
  content: string;

  @Prop({ default: () => new Date() }) // Automatically set creation date
  createdAt: Date;
}

export const ReplySchema = SchemaFactory.createForClass(Reply);
