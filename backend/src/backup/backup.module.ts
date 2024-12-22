import { Module } from '@nestjs/common';
import{ BackupService} from './backup.service'; 
import { BackupController } from './backup.controller';
import { BackupScheduler } from './backup.scheduler';

@Module({
  controllers: [BackupController],
  providers: [BackupService, BackupScheduler],
})
export class BackupModule {}
