import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization']?.split(' ')[1];  

    if (!token) {
      throw new UnauthorizedException('No token found');
    }

    try {
      const decoded = await this.jwtService.verifyAsync(token);
      req.user = decoded;  // Attach user to request object
      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
