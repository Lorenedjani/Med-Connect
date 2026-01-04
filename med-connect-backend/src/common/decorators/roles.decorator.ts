import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../constants/roles.constant';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

export const REQUIRE_VERIFIED_DOCTOR_KEY = 'requireVerifiedDoctor';
export const RequireVerifiedDoctor = () => SetMetadata(REQUIRE_VERIFIED_DOCTOR_KEY, true);

