import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema(
  {
    name: {type: String,required: true,},
    email: {type: String,required: true,unique: true,},
    passwordHash: {type: String,required: true,
    },role: {type: String,required: true,
enum: ['student', 'instructor', 'admin'], // Validates the role
    },
    profilePictureUrl: {type: String,required: false,},
  });

  export interface Users {
     name: string;
     email: string;
     passwordHash: string;
     role: 'student' | 'instructor' | 'admin';
     profilePictureUrl?: string;
  }