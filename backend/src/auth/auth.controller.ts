import {
  Body,
  Controller,
  HttpStatus,
  Post,
  HttpException,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response, Request } from 'express';
import { LogsService } from '../logs/logs.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logsService: LogsService, // Inject LogsService
  ) {}

  // Login Endpoint
  @Post('login')
async signIn(
  @Body() signInDto: LoginDto,
  @Res({ passthrough: true }) res: Response,
  @Req() req: Request,
) {
  const ip = req.ip;

  try {
    const result = await this.authService.signIn(signInDto.email, signInDto.password);

    // Store the JWT as an HTTP-only cookie
    res.cookie('token', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600 * 1000,
    });

    // Store user details in a separate cookie for client-side access
    res.cookie('user', JSON.stringify(result.userPayload), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600 * 1000,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Login successful',
    };
  } catch (error) {
    // Log failed login attempts with email
    await this.logsService.createLog(
      'failed_login',
      'Invalid email or password',
      ip,
      undefined,
      signInDto.email, // Include the email used in the failed attempt
    );

    throw new HttpException(
      { message: error.message || 'Login failed' },
      error.status || HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
}
