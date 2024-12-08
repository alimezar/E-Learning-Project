import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron } from 'node-cron';
import { BackupService } from './backup.service';
import { CreateBackupDto } from './dto/create-backup.dto';

@Injectable()
export class BackupScheduler implements OnModuleInit {
  constructor(private readonly backupService: BackupService) {}

  async onModuleInit() {
    console.log('Application has started. Running initial backup...');
    await this.runBackup(); // Run backup immediately on startup
    this.scheduleBackups(); // Schedule periodic backups
  }

  private async runBackup(): Promise<void> {
    const backupDto: CreateBackupDto = {
      collections: ['users', 'courses'], // Add the collections you want to backup
      includeSensitiveData: false,
    };

    try {
      await this.backupService.backupImportantData(backupDto);
      console.log('Initial backup completed successfully.');
    } catch (error) {
      console.error('Error during initial backup:', error);
    }
  }

  private scheduleBackups(): void {
    // Run backups every 12 hours (adjust as needed)
    const cronExpression = '0 */12 * * *'; // Every 12 hours
    // const cronExpression = '*/5 * * * *'; // Uncomment for every 5 minutes

    Cron.schedule(cronExpression, async () => {
      console.log('Running scheduled backup...');
      await this.runBackup();
    });

    console.log('Backup schedule initialized.');
  }
}
