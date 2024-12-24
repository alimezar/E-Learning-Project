import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { LogsModule } from '../logs/logs.module';
import * as dotenv from 'dotenv';
import { AuthorizationGuard } from './guards/authorization.guard';
dotenv.config();

@Module({
  imports: [
    UsersModule,
    PassportModule,
    LogsModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET, 
      signOptions: { expiresIn: '1h' }, 
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
