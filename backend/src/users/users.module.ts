import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './users.schema';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CoursesModule } from '../courses/courses.module'; 


@Module({
    imports:[MongooseModule.forFeature([{name: 'Users',schema:UserSchema}]),CoursesModule,],
    providers: [UsersService],
    controllers: [UsersController],
    exports: [MongooseModule, UsersService]
})
export class UsersModule {}
