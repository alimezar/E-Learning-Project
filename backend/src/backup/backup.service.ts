import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';

import { Users } from '../users/users.schema';
import { Progress } from '../progress/progress.schema'; // Import Progress schema

@Injectable()
export class BackupService {
  constructor(
    @InjectModel('Users') private readonly userModel: Model<Users>, // Main database users model
    @InjectModel('Progress') private readonly progressModel: Model<Progress>, // Main database progress model
  ) {}

  async backupUsers(): Promise<void> {
    try {
      console.log('Starting users backup...');

      const users = await this.userModel.find().exec();
      console.log(`Fetched ${users.length} users from the database.`);

      try {
        const backupModel = this.userModel.db.useDb('backup').model('Users', this.userModel.schema);
        await backupModel.insertMany(users);
        console.log('Users backup completed successfully.');
      } catch (dbError) {
        console.error('Failed to connect to backup database. Saving users locally...');

        const backupFolderPath = path.resolve(__dirname, '../../backups'); 
        if (!fs.existsSync(backupFolderPath)) {
          fs.mkdirSync(backupFolderPath, { recursive: true });
        }

        const backupFileName = `users-backup-${new Date().toISOString().replace(/:/g, '-')}.json`;
        const backupFilePath = path.join(backupFolderPath, backupFileName);

        fs.writeFileSync(backupFilePath, JSON.stringify(users, null, 2));
        console.log('Users data saved locally.');
      }
    } catch (error) {
      console.error('Error during the users backup process:', error.message);
      throw error;
    }
  }

  async backupProgress(): Promise<void> {
    try {
      console.log('Starting progress backup...');

      const progress = await this.progressModel.find().exec();
      console.log(`Fetched ${progress.length} progress records from the database.`);

      try {
        const backupModel = this.progressModel.db.useDb('backup').model('Progress', this.progressModel.schema);
        await backupModel.insertMany(progress);
        console.log('Progress backup completed successfully.');
      } catch (dbError) {
        console.error('Failed to connect to backup database. Saving progress locally...');

        const backupFolderPath = path.resolve(__dirname, '../../backups'); 
        if (!fs.existsSync(backupFolderPath)) {
          fs.mkdirSync(backupFolderPath, { recursive: true });
        }

        const backupFileName = `progress-backup-${new Date().toISOString().replace(/:/g, '-')}.json`;
        const backupFilePath = path.join(backupFolderPath, backupFileName);

        fs.writeFileSync(backupFilePath, JSON.stringify(progress, null, 2));
        console.log('Progress data saved locally.');
      }
    } catch (error) {
      console.error('Error during the progress backup process:', error.message);
      throw error;
    }
  }
}
