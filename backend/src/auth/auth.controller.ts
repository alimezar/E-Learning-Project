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
  import { SignUpDto } from './dto/sign-up.dto';
  import { LoginDto } from './dto/login.dto';
  import { Response } from 'express';
  
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
        console.log('Login attempt:', signInDto.email);
        const result = await this.authService.signIn(
          signInDto.email,
          signInDto.password,
        );
  
        // Set the token as an HTTP-only cookie
        res.cookie('token', result.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 3600 * 1000, // 1 hour
        });
  
        return {
          statusCode: HttpStatus.OK,
          message: 'Login successful',
          user: result.userPayload,
        };
      } catch (error) {
        console.error('Login error:', error.message);
  
        if (error instanceof HttpException) {
          throw error; // Pass through known exceptions
        }
  
        throw new HttpException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'An error occurred during login',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
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
  