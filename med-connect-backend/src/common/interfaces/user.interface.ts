import { UserRole, UserStatus, DoctorVerificationStatus } from '../constants/roles.constant';

export interface IUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPatient extends IUser {
  dateOfBirth?: Date;
  gender?: string;
  phone?: string;
  address?: IAddress;
  emergencyContact?: IEmergencyContact;
  medicalInfo?: IMedicalInfo;
}

export interface IDoctor extends IUser {
  licenseNumber: string;
  specialty: string;
  verificationStatus: DoctorVerificationStatus;
  experience?: number;
  education?: IEducation[];
  certifications?: ICertification[];
  clinicAddress?: IAddress;
  consultationFee?: number;
  availability?: IAvailability;
}

export interface IAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface IEmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface IMedicalInfo {
  bloodType?: string;
  allergies?: string[];
  currentMedications?: string[];
  chronicConditions?: string[];
  height?: number;
  weight?: number;
}

export interface IEducation {
  institution: string;
  degree: string;
  year: number;
  specialization?: string;
}

export interface ICertification {
  name: string;
  issuer: string;
  issueDate: Date;
  expiryDate?: Date;
  credentialId?: string;
}

export interface IAvailability {
  workingDays: string[];
  workingHours: {
    start: string;
    end: string;
  };
  breakTimes?: {
    start: string;
    end: string;
  }[];
  timeZone: string;
}

export interface IJwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface IRefreshTokenPayload {
  sub: string;
  tokenId: string;
  iat?: number;
  exp?: number;
}

