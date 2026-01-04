import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UserRole } from '../constants/roles.constant';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class DoctorVerifiedGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as IJwtPayload;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Only doctors need verification check
    if (user.role !== UserRole.DOCTOR) {
      return true;
    }

    // Check if doctor is verified
    // This would typically query the database to check verification status
    // For now, we'll assume the JWT payload contains verification status
    const isVerified = (user as any).isVerified;

    if (!isVerified) {
      throw new ForbiddenException(
        'Doctor account not verified. Please complete verification process.'
      );
    }

    return true;
  }
}

