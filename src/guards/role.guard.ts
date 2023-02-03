import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { LeanDocument } from 'mongoose';
import { UserLeanDocument } from 'src/modules/users/entities/user.entity';
import { ERole } from 'src/modules/users/users.enum';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]) as ERole[];

    if (!requiredRoles) {
      return true;
    }

    const user: LeanDocument<UserLeanDocument> = context
      .switchToHttp()
      .getRequest().user;

    if (!user || !user.role) {
      return false;
    }

    return requiredRoles.includes(user.role);
  }
}
