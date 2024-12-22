import { Controller, Post } from '@nestjs/common';
import { BackupService } from './backup.service';

@Controller('backup')
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Post('users')
  async backupUsers(): Promise<string> {
    await this.backupService.backupUsers();
    return 'Users backup successfully done.';
  }

  @Post('progress')
  async backupProgress(): Promise<string> {
    await this.backupService.backupProgress();
    return 'Progress backup successfully done.';
  }
}
