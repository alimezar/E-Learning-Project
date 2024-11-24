import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './users.schema';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
    imports:[MongooseModule.forFeature([{name: 'Users',schema:UserSchema}])],
    providers: [UsersService],
    controllers: [UsersController],
    exports: [MongooseModule]
})
export class UsersModule {}
