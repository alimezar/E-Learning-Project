import { Users } from './users.model';
import { Model } from 'mongoose';
export declare class UsersService {
    private readonly userModel;
    constructor(userModel: Model<Users>);
    createUser(userData: Partial<Users>): Promise<Users>;
    getUsers(): Promise<Users[]>;
    getUserById(userId: string): Promise<Users>;
    updateUser(userId: string, updateData: Partial<Users>): Promise<Users>;
    deleteUser(userId: string): Promise<void>;
}
