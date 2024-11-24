import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';//mongoose
import { Progress, ProgressSchema } from './progress.schema';
import { ProgressService } from './progress.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Progress.name, schema: ProgressSchema }])],
  providers: [ProgressService],
  exports: [ProgressService], 
})

export class ProgressModule {}
