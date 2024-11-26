import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = Users & Document;

@Schema({ timestamps: true })
export class Users {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true, enum: ['student', 'instructor', 'admin'] })
  role: 'student' | 'instructor' | 'admin';

  @Prop()
  profilePictureUrl?: string;
}


export interface Users {
  _id: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(Users);
