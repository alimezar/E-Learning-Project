import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LogDocument = Logs & Document;

@Schema({ timestamps: true })
export class Logs {
  @Prop({ type: String, enum: ['failed_login', 'unauthorized_access', 'instructor_request'], required: true })
  type: 'failed_login' | 'unauthorized_access' | 'instructor_request';

  @Prop({ type: String, required: true })
  message: string;

  @Prop({ type: String })
  ip: string;

  @Prop({ type: Types.ObjectId, ref: 'Users', required: false })
  userId?: string;

  @Prop({ type: String })
  email?: string;
}

export const LogSchema = SchemaFactory.createForClass(Logs);
