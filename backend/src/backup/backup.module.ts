import { Module } from '@nestjs/common';
import { BackupService } from './backup.service';
import { BackupController } from './backup.controller';
import { UsersModule } from '../users/users.module'; 
import { ProgressModule } from '../progress/progress.module'; // Added import for ProgressModule
import * as cron from 'node-cron';

@Module({
  imports: [UsersModule, ProgressModule], // Added ProgressModule
  providers: [
    BackupService,
    {
      provide: 'BackupScheduler',
      useFactory: (backupService: BackupService) => {
        // Backup every 30 minutes
        cron.schedule('*/1 * * * *', async () => {
          console.log('Backup running...');
          try {
            await backupService.backupUsers();
            await backupService.backupProgress(); // Added progress backup
            console.log('Backup completed.');
          } catch (error) {
            console.error('Backup failed:', error.message);
          }
        });
      },
      inject: [BackupService],
    },
  ],
  controllers: [BackupController],
})
export class BackupModule {}
