import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Progress, ProgressSchema } from './progress.schema';
import { ProgressService } from './progress.service';
import { UsersModule } from '../users/users.module';
import { CoursesModule } from '../courses/courses.module';
import { ProgressController } from './progress.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Progress.name, schema: ProgressSchema }]), UsersModule, CoursesModule, 
  ],
  providers: [ProgressService],
  controllers: [ProgressController], 
  exports: [ProgressService],
})
export class ProgressModule {}
