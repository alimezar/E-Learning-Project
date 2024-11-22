import { UsersService } from './users.service';
import { Users } from './users.model';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    createUser(userData: Partial<Users>): Promise<Users>;
    getAllUsers(): Promise<Users[]>;
    getUser(id: string): Promise<Users>;
    updateUser(id: string, updateData: Partial<Users>): Promise<Users>;
    deleteUser(id: string): Promise<void>;
}
