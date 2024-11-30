import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role, ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class authorizationGuard implements CanActivate {
  constructor(private reflector: Reflector) { }
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
      const { user } = context.switchToHttp().getRequest();
      if(!user)
        throw new UnauthorizedException('no user attached');
      const userRole = user.role
      if (!requiredRoles.includes(userRole)) 
        throw new UnauthorizedException('unauthorized access');
       
    return true;
  }
}