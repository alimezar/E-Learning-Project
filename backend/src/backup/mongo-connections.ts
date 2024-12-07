import { MongoClient } from 'mongodb';

const MAIN_DB_URI = 'mongodb+srv://koshty:Pm07DIXleojhZaqD@e-learning.k67sj.mongodb.net/e-learning';
const BACKUP_DB_URI = 'mongodb+srv://zeyadgob:3Oy0ZvelxZ3AfRY7@cluster0.mu7ve.mongodb.net/';

export async function connectToMainDB() {
  const client = new MongoClient(MAIN_DB_URI);
  await client.connect();
  return client.db(); // Returns the default database from the URI
}

export async function connectToBackupDB() {
  const client = new MongoClient(BACKUP_DB_URI);
  await client.connect();
  return client.db(); // Returns the default database from the URI
}
