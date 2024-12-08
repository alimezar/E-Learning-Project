import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { BackupService } from './backup.service';
import { CreateBackupDto } from './dto/create-backup.dto';

@Controller('backup')
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Post()
  async createBackup(@Body() createBackupDto: CreateBackupDto): Promise<{ message: string }> {
    try {
      await this.backupService.backupImportantData(createBackupDto);
      return { message: 'Backup completed successfully.' };
    } catch (error) {
      console.error('Error during backup:', error);
      throw new HttpException(
        { message: 'Failed to complete the backup.', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
