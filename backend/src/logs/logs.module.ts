import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LogsService } from './logs.service';
import { LogsController } from './logs.controller';
import { Logs, LogSchema } from './logs.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Logs.name, schema: LogSchema }]), // Register Log schema
  ],
  controllers: [LogsController],
  providers: [LogsService],
  exports: [LogsService],
})
export class LogsModule {}
