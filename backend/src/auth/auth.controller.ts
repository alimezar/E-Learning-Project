import {
    Body,
    Controller,
    HttpStatus,
    Post,
    HttpException,
    Get,
    Res,
    Req,
    UseGuards
  } from '@nestjs/common';
  import { AuthService } from './auth.service';
  import { SignUpDto } from './dto/sign-up.dto';
  import { LoginDto } from './dto/login.dto';
  import { Response } from 'express';
  import { AuthGuard } from './guards/authentication.guard';
  

  
  @Controller('auth')
  export class AuthController {
    constructor(private readonly authService: AuthService) {}
  
    // Login Endpoint
    @Post('login')
    async signIn(
      @Body() signInDto: LoginDto,
      @Res({ passthrough: true }) res: Response,
    ) {
      try {
        const result = await this.authService.signIn(
          signInDto.email,
          signInDto.password,
        );
    
        // Store the JWT as an HTTP-only cookie
        res.cookie('token', result.accessToken, {
          httpOnly: true, // Protect against XSS
          secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
          maxAge: 3600 * 1000, // 1 hour
        });
    
        // Store user details in a separate cookie for client-side access
        res.cookie('user', JSON.stringify(result.userPayload), {
          httpOnly: false, // Allow client-side access
          secure: process.env.NODE_ENV === 'production',
          maxAge: 3600 * 1000, // 1 hour
        });
    
        return {
          statusCode: HttpStatus.OK,
          message: 'Login successful',
        };
      } catch (error) {
        throw new HttpException(
          { message: error.message || 'Login failed' },
          error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
    
  
    // Registration Endpoint
    @Post('register')
    async register(@Body() registerRequestDto: SignUpDto) {
      try {
        console.log('Registration attempt for:', registerRequestDto.email);
        const result = await this.authService.register(registerRequestDto);
  
        return {
          statusCode: HttpStatus.CREATED,
          message: 'User registered successfully',
          data: result,
        };
      } catch (error) {
        console.error('Registration error:', error.message);
  
        if (error.status === 409) {
          throw new HttpException(
            {
              statusCode: HttpStatus.CONFLICT,
              message: 'User already exists',
            },
            HttpStatus.CONFLICT,
          );
        }
  
        throw new HttpException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'An error occurred during registration',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
}
  
  