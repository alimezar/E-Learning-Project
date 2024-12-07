import { Injectable } from '@nestjs/common';
import { connectToMainDB, connectToBackupDB } from './mongo-connections';
import { CreateBackupDto } from './dto/create-backup.dto';

@Injectable()
export class BackupService {
  async backupImportantData(dto: CreateBackupDto): Promise<void> {
    const { includeSensitiveData, collections } = dto;

    try {
      const mainDb = await connectToMainDB();
      const backupDb = await connectToBackupDB();

      for (const collection of collections) {
        const data = await mainDb.collection(collection).find().toArray();

        if (!includeSensitiveData) {
          data.forEach((item) => delete item.password); // Remove sensitive fields
        }

        await backupDb.collection(collection).insertMany(data);
        console.log(`Backup completed for collection: ${collection}`);
      }

      console.log('All backups completed successfully');
    } catch (error) {
      console.error('Error during backup:', error);
    }
  }
}

// Ensure this export is present
export default BackupService;
