import { Controller, Post } from '@nestjs/common';
import { BackupService } from './backup.service';

@Controller('backup')
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Post('users')
  async backupUsers(): Promise<string> {
    await this.backupService.backupUsers();
    return 'Users backed up successfully!';
  }
}
