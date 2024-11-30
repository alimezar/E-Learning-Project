import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users, UserDocument } from './users.schema'; 
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('Users') private readonly userModel: Model<Users>) {}

    async createUser(createUserDto: CreateUserDto): Promise<Users> {
      const { password, ...rest } = createUserDto;
    
      // Hash the password
      const passwordHash = await bcrypt.hash(password, 10);
    
      // Save the user with the hashed password
      const newUser = new this.userModel({ ...rest, passwordHash });
      return await newUser.save();
    }
    
      async getUsers(): Promise<Users[]> {
        return this.userModel.find().exec();
      }

      
  async getUserByEmail(email: string): Promise<UserDocument | null> {
    const user = await this.userModel.findOne({ email }).exec();
    return user || null; // Return null if user is not found
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