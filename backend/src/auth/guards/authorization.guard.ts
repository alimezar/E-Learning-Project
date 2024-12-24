import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    const request = context.switchToHttp().getRequest();

    // Log cookies for debugging
    console.log('All cookies:', request.cookies);

    // Extract the "user" cookie
    const userCookie = request.cookies?.user;
    if (!userCookie) {
      throw new UnauthorizedException('User cookie missing');
    }

    let user;
    try {
      // Decode and parse the user cookie
      user = JSON.parse(decodeURIComponent(userCookie));
      request.user = user; // Attach parsed user data to the request object
    } catch (err) {
      console.error('Error parsing user cookie:', err);
      throw new UnauthorizedException('Invalid user cookie format');
    }

    // Check if the user's role matches the required roles
    if (requiredRoles && !requiredRoles.includes(user.role)) {
      throw new UnauthorizedException('You are not authorized to perform this action');
    }

    return true; // Authorization successful
  }
}
