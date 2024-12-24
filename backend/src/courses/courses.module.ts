import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from './courses.schema';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { UsersModule } from 'src/users/users.module';
import { ModulesModule } from 'src/modules/modules.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthorizationGuard } from 'src/auth/guards/authorization.guard';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
    forwardRef(() => UsersModule), forwardRef(() => ModulesModule), JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }), // Forward ref 
  ],
  providers: [CoursesService, AuthorizationGuard],
  controllers: [CoursesController],
  exports: [MongooseModule, CoursesService],
})
export class CoursesModule {}
