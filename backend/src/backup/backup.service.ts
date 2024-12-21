import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import AdmZip from 'adm-zip';
import { Users } from '../users/users.schema';

@Injectable()
export class BackupService {
  constructor(
    @InjectModel('Users') private readonly userModel: Model<Users>, // Main DB Users model
  ) {}

  async backupUsers(): Promise<void> {
    try {
      console.log('starting backup ');

      //  fetch data from the main database
      const users = await this.userModel.find().exec();
      console.log(`fetched ${users.length} users database.`);

      
      try {
        const backupModel = this.userModel.db.useDb('backup').model('Users', this.userModel.schema);
        await backupModel.insertMany(users);
        console.log('backup completed successfully .');
      } catch (dbError) {
        console.error('failed  to  connect to  mongo database saving data locally');

        
        const backupFolderPath = path.resolve(__dirname, '../../backups'); 
        if (!fs.existsSync(backupFolderPath)) {
          fs.mkdirSync(backupFolderPath, { recursive: true }); 
        }

        // Step 4: Save data as a JSON file
        const backupFileName = `users-backup-${new Date().toISOString().replace(/:/g, '-')}.json`; 
        const backupFilePath = path.join(backupFolderPath, backupFileName);

        fs.writeFileSync(backupFilePath, JSON.stringify(users, null, 2));
        console.log(`Backup saved to file: ${backupFilePath}`);

        // Step 5: Compress the backup file into a zip
        const zip = new AdmZip();
        zip.addLocalFile(backupFilePath);
        const zipFilePath = path.join(backupFolderPath, `users-backup-${new Date().toISOString().replace(/:/g, '-')}.zip`);
        zip.writeZip(zipFilePath);

        console.log(`Backup compressed to ZIP: ${zipFilePath}`);

        // Clean up the uncompressed JSON file
        fs.unlinkSync(backupFilePath);
      }
    } catch (error) {
      console.error('Error during the backup process:', error.message);
      throw error;
    }
  }
}
