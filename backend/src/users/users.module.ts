import { Module } from '@nestjs/common';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { UserSchema } from './users.model';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
    imports:[MongooseModule.forFeature([{name: 'Users',schema:UserSchema}])],
    providers: [UsersService],
    controllers: [UsersController]
})
export class UsersModule {}
