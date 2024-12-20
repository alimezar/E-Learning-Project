import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from './courses.schema';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { UsersModule } from 'src/users/users.module';
import { ModulesModule } from 'src/modules/modules.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
    forwardRef(() => UsersModule), forwardRef(() => ModulesModule), // Use forwardRef
  ],
  providers: [CoursesService],
  controllers: [CoursesController],
  exports: [MongooseModule, CoursesService],
})
export class CoursesModule {}
