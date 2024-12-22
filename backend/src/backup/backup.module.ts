import { Module } from '@nestjs/common';
import { BackupService } from './backup.service';
import { BackupController } from './backup.controller';
import { UsersModule } from '../users/users.module'; 
import * as cron from 'node-cron';

@Module({
  imports: [UsersModule], 
  providers: [
    BackupService,
    {
      provide: 'BackupScheduler',
      useFactory: (backupService: BackupService) => {
        //backup every 30 min  edit to test
        cron.schedule('*/30 * * * *', async () => {
          console.log('backup runing .');
          try {
            await backupService.backupUsers();
            console.log(' backup completed   ');
          } catch (error) {
            console.error(' backup failed:', error.message);
          }
        });
      },
      inject: [BackupService],
    },
  ],
  controllers: [BackupController],
})
export class BackupModule {}
