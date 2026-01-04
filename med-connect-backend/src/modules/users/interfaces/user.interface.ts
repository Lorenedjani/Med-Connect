import { UserRole, UserStatus } from '../../../common/constants/roles.constant';

export interface IUserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  isEmailVerified: boolean;
  phone?: string;
  profilePictureUrl?: string;
  dateOfBirth?: Date;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  fullName: string;
}

export interface ICreateUser {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  phone?: string;
  dateOfBirth?: string;
  licenseNumber?: string;
  specialty?: string;
  bio?: string;
  experience?: number;
  clinicAddress?: string;
  consultationFee?: number;
}

export interface ISearchUsersFilter {
  role?: UserRole;
  search?: string;
  specialty?: string;
  acceptingNewPatients?: boolean;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface INearbyDoctorsQuery {
  latitude: number;
  longitude: number;
  radius?: number;
  specialty?: string;
}

export interface IUserStats {
  totalUsers: number;
  totalPatients: number;
  totalDoctors: number;
  verifiedDoctors: number;
}

