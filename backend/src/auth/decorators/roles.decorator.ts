import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
export enum Role {
    User = 'student',
    Instructor ='instructor',
    Admin = 'admin',
  }
