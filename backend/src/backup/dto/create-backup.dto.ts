export class CreateBackupDto {
    includeSensitiveData: boolean; // Whether sensitive data like passwords should be included
    collections: string[]; // Collections to back up
  }
  