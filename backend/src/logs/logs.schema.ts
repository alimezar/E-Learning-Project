import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LogDocument = Logs & Document;

@Schema({ timestamps: true })
export class Logs {
  @Prop({ type: Date, default: Date.now })
  timestamp: Date;

  @Prop({ type: String, enum: ['failed_login', 'unauthorized_access'], required: true })
  type: 'failed_login' | 'unauthorized_access';

  @Prop({ type: String, required: true })
  message: string;

  @Prop({ type: String, required: true })
  ip: string;

  @Prop({ type: Types.ObjectId, ref: 'Users', required: false })
  userId?: string;

  @Prop({ type: String, required: false })
  email?: string;
}

export const LogSchema = SchemaFactory.createForClass(Logs);
