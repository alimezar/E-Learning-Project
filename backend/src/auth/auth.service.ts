import { Injectable, UnauthorizedException, ConflictException, NotFoundException  } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { SignUpDto } from './dto/sign-up.dto';
import { LoginDto } from './dto/login.dto';
import { Users } from '../users/users.schema';
import * as jwt from 'jsonwebtoken';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}


  // Registration logic
  async register(signUpDto: SignUpDto): Promise<Users> {
    const existingUser = await this.usersService.getUserByEmail(signUpDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
  
    const hashedPassword = await bcrypt.hash(signUpDto.password, 10);
    return this.usersService.createUser({
      ...signUpDto,
      password: hashedPassword,
    });
  }

  // Login logic
  async signIn(email: string, password: string): Promise<{ accessToken: string; userPayload: any }> {
    const user = await this.usersService.getUserByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { userId: user._id.toString(), role: user.role }; 
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      userPayload: { id: user._id.toString(), name: user.name, role: user.role },
    };
  }
}
