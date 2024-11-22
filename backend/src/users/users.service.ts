import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from './users.schema'; 
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('Users') private readonly userModel: Model<Users>) {}

    async createUser(userData: Partial<Users>): Promise<Users> {
        const newUser = new this.userModel(userData);
        return newUser.save();
      }
    
      async getUsers(): Promise<Users[]> {
        return this.userModel.find().exec();
      }
    
      async getUserById(userId: string): Promise<Users> {
        const user = await this.userModel.findById(userId).exec();
        if (!user) {
          throw new NotFoundException(`User with ID ${userId} not found`);
        }
        return user;
      }
    
      async updateUser(userId: string, updateData: Partial<Users>): Promise<Users> {
        const updatedUser = await this.userModel
          .findByIdAndUpdate(userId, updateData, { new: true })
          .exec();
        if (!updatedUser) {
          throw new NotFoundException(`User with ID ${userId} not found`);
        }
        return updatedUser;
      }
    
      async deleteUser(userId: string): Promise<void> {
        const result = await this.userModel.findByIdAndDelete(userId).exec();
        if (!result) {
          throw new NotFoundException(`User with ID ${userId} not found`);
        }
      }
    
}