import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';

import { Users } from '../users/users.schema';

@Injectable()
export class BackupService {
  constructor(
    @InjectModel('Users') private readonly userModel: Model<Users>, // main database  users model
  ) {}

  async backupUsers(): Promise<void> {
    try {
      console.log('starting backup ');

      
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

        
        const backupFileName = `users-backup-${new Date().toISOString().replace(/:/g, '-')}.json`; 
        const backupFilePath = path.join(backupFolderPath, backupFileName);

        fs.writeFileSync(backupFilePath, JSON.stringify(users, null, 2));
        console.log('data saved locally ');

        
      }
    } catch (error) {
      console.error('Error during the backup process:', error.message);
      throw error;
    }
  }
}
