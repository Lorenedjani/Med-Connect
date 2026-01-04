import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePatientProfileDto } from './dto/update-patient-profile.dto';
import { UpdateDoctorProfileDto } from './dto/update-doctor-profile.dto';
import { SearchUsersDto } from './dto/search-users.dto';
import { UserProfileDto } from './dto/user-profile.dto';
import { UsersRepository } from './users.repository';
import { User } from './entities/user.entity';
import { Patient } from './entities/patient.entity';
import { Doctor } from './entities/doctor.entity';
import { UserRole } from '../../common/constants/roles.constant';
import { EncryptionUtil } from '../../common/utils/encryption.util';
import { IPaginatedResponse, PaginationMeta } from '../../common/interfaces/pagination.interface';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserProfileDto> {
    const { email, role, ...userData } = createUserDto;

    // Check if user already exists
    const existingUser = await this.usersRepository.findUserByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await EncryptionUtil.hashPassword(createUserDto.password);

    // Prepare user data with proper date conversion
    const { password: _, ...userDataWithoutPassword } = userData;
    const userDataWithDates = {
      ...userDataWithoutPassword,
      dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth) : undefined,
    };

    // Create user
    const user = await this.usersRepository.createUser({
      email,
      password: hashedPassword,
      role,
      isEmailVerified: false,
      ...userDataWithDates,
    });

    // Create role-specific profile
    if (role === UserRole.PATIENT) {
      await this.createPatientProfile(user.id, createUserDto);
    } else if (role === UserRole.DOCTOR) {
      await this.createDoctorProfile(user.id, createUserDto);
    }

    // Emit user registered event
    this.eventEmitter.emit('user.registered', { user });

    const userWithProfile = await this.usersRepository.findUserById(user.id, ['patientProfile', 'doctorProfile']);
    return this.mapToUserProfileDto(userWithProfile!);
  }

  async getUserProfile(userId: string): Promise<UserProfileDto> {
    const user = await this.usersRepository.findUserById(userId, ['patientProfile', 'doctorProfile']);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.mapToUserProfileDto(user);
  }

  async updateUserProfile(userId: string, updateUserDto: UpdateUserDto): Promise<UserProfileDto> {
    const user = await this.usersRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Prepare update data with proper date conversion
    const updateData = {
      ...updateUserDto,
      dateOfBirth: updateUserDto.dateOfBirth ? new Date(updateUserDto.dateOfBirth) : undefined,
    };

    await this.usersRepository.updateUser(userId, updateData);

    const updatedUser = await this.usersRepository.findUserById(userId, ['patientProfile', 'doctorProfile']);
    return this.mapToUserProfileDto(updatedUser!);
  }

  async updatePatientProfile(
    userId: string,
    updatePatientDto: UpdatePatientProfileDto,
  ): Promise<UserProfileDto> {
    const user = await this.usersRepository.findUserById(userId, ['patientProfile']);
    if (!user || user.role !== UserRole.PATIENT) {
      throw new NotFoundException('Patient profile not found');
    }

    // Transform string fields to JSON strings for storage
    const transformedData: any = {
      ...updatePatientDto,
      allergies: updatePatientDto.allergies ? JSON.stringify(updatePatientDto.allergies.split(',').map(a => a.trim())) : undefined,
      currentMedications: updatePatientDto.currentMedications ? JSON.stringify(updatePatientDto.currentMedications.split(',').map(m => m.trim())) : undefined,
      chronicConditions: updatePatientDto.chronicConditions ? JSON.stringify(updatePatientDto.chronicConditions.split(',').map(c => c.trim())) : undefined,
      lastPhysicalExam: updatePatientDto.lastPhysicalExam ? new Date(updatePatientDto.lastPhysicalExam) : undefined,
    };

    if (user.patientProfile) {
      await this.usersRepository.updatePatientProfile(userId, transformedData);
    } else {
      await this.usersRepository.createPatientProfile({
        userId,
        ...transformedData,
      });
    }

    const updatedUser = await this.usersRepository.findUserById(userId, ['patientProfile']);
    return this.mapToUserProfileDto(updatedUser!);
  }

  async updateDoctorProfile(
    userId: string,
    updateDoctorDto: UpdateDoctorProfileDto,
  ): Promise<UserProfileDto> {
    const user = await this.usersRepository.findUserById(userId, ['doctorProfile']);
    if (!user || user.role !== UserRole.DOCTOR) {
      throw new NotFoundException('Doctor profile not found');
    }

    if (user.doctorProfile) {
      await this.usersRepository.updateDoctorProfile(userId, updateDoctorDto);
    } else {
      await this.usersRepository.createDoctorProfile({
        userId,
        ...updateDoctorDto,
      });
    }

    const updatedUser = await this.usersRepository.findUserById(userId, ['doctorProfile']);
    return this.mapToUserProfileDto(updatedUser!);
  }

  async searchUsers(query: SearchUsersDto): Promise<IPaginatedResponse<UserProfileDto>> {
    const [users, total] = await this.usersRepository.findUsers(query);

    const userProfileDtos = users.map(user => this.mapToUserProfileDto(user));

    return {
      data: userProfileDtos,
      meta: new PaginationMeta(query.page ?? 1, query.limit ?? 20, total),
    };
  }

  async deleteUser(userId: string): Promise<void> {
    const user = await this.usersRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.usersRepository.deleteUser(userId);

    // Emit user deleted event
    this.eventEmitter.emit('user.deleted', { userId, email: user.email });
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.usersRepository.updateLastLogin(userId);
  }

  async getUserStats() {
    return this.usersRepository.getUserStats();
  }

  async findNearbyDoctors(
    latitude: number,
    longitude: number,
    radiusKm: number = 50,
    specialty?: string,
  ): Promise<UserProfileDto[]> {
    const doctors = await this.usersRepository.findNearbyDoctors(latitude, longitude, radiusKm, specialty);
    return doctors.map(doctor => this.mapToUserProfileDto(doctor.user));
  }

  private async createPatientProfile(userId: string, createUserDto: CreateUserDto): Promise<void> {
    const patientData: any = {
      userId,
      dateOfBirth: createUserDto.dateOfBirth ? new Date(createUserDto.dateOfBirth) : undefined,
    };

    await this.usersRepository.createPatientProfile(patientData);
  }

  private async createDoctorProfile(userId: string, createUserDto: CreateUserDto): Promise<void> {
    const doctorData: Partial<Doctor> = {
      userId,
      licenseNumber: createUserDto.licenseNumber,
      specialty: createUserDto.specialty,
      bio: createUserDto.bio,
      experience: createUserDto.experience,
      clinicAddress: createUserDto.clinicAddress,
      consultationFee: createUserDto.consultationFee,
    };

    await this.usersRepository.createDoctorProfile(doctorData);
  }

  private mapToUserProfileDto(user: User): UserProfileDto {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      role: user.role,
      status: user.status,
      isEmailVerified: user.isEmailVerified,
      phone: user.phone,
      profilePictureUrl: user.profilePictureUrl,
      dateOfBirth: user.dateOfBirth,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastLoginAt: user.lastLoginAt,
      fullName: user.fullName,
    };
  }
}
