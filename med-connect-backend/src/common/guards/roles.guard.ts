import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole, ROLE_HIERARCHY } from '../constants/roles.constant';
import { ROLES_KEY, REQUIRE_VERIFIED_DOCTOR_KEY } from '../decorators/roles.decorator';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const requireVerifiedDoctor = this.reflector.getAllAndOverride<boolean>(
      REQUIRE_VERIFIED_DOCTOR_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles && !requireVerifiedDoctor) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as IJwtPayload;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Check role-based access
    if (requiredRoles) {
      const userRoleHierarchy = ROLE_HIERARCHY[user.role as UserRole];
      const hasRequiredRole = requiredRoles.some((role) => {
        const requiredRoleHierarchy = ROLE_HIERARCHY[role];
        return userRoleHierarchy >= requiredRoleHierarchy;
      });

      if (!hasRequiredRole) {
        throw new ForbiddenException('Insufficient permissions');
      }
    }

    // Check doctor verification requirement
    if (requireVerifiedDoctor && user.role === UserRole.DOCTOR) {
      // Note: This would need to be checked against the actual user entity
      // For now, we'll assume the JWT payload contains verification status
      // In a real implementation, you'd query the database here
      const isVerified = (user as any).isVerified;
      if (!isVerified) {
        throw new ForbiddenException('Doctor account not verified');
      }
    }

    return true;
  }
}

