import { Injectable } from '@nestjs/common';
import { Repository, DataSource, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Patient } from './entities/patient.entity';
import { Doctor } from './entities/doctor.entity';
import { SearchUsersDto } from './dto/search-users.dto';
import { UserRole, DoctorVerificationStatus } from '../../common/constants/roles.constant';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    private readonly dataSource: DataSource,
  ) {}

  async createUser(createUserDto: Partial<User>): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findUserById(id: string, relations: string[] = []): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations,
    });
  }

  async findUserByEmail(email: string, relations: string[] = []): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      relations,
    });
  }

  async findUsers(query: SearchUsersDto): Promise<[User[], number]> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    // Apply filters
    if (query.role) {
      queryBuilder.andWhere('user.role = :role', { role: query.role });
    }

    if (query.search) {
      const searchTerm = `%${query.search}%`;
      queryBuilder.andWhere(
        '(user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search)',
        { search: searchTerm },
      );
    }

    // Add role-specific filters
    if (query.role === UserRole.DOCTOR) {
      queryBuilder.leftJoinAndSelect('user.doctorProfile', 'doctor');

      if (query.specialty) {
        queryBuilder.andWhere('doctor.specialty ILIKE :specialty', {
          specialty: `%${query.specialty}%`,
        });
      }

      if (query.acceptingNewPatients !== undefined) {
        queryBuilder.andWhere('doctor.isAcceptingNewPatients = :accepting', {
          accepting: query.acceptingNewPatients,
        });
      }

      // Add sorting for doctors
      this.applyDoctorSorting(queryBuilder, query.sortBy, query.sortOrder);
    } else if (query.role === UserRole.PATIENT) {
      queryBuilder.leftJoinAndSelect('user.patientProfile', 'patient');
    }

    // Apply pagination
    const skip = ((query.page ?? 1) - 1) * (query.limit ?? 20);
    queryBuilder.skip(skip).take(query.limit ?? 20);

    return queryBuilder.getManyAndCount();
  }

  async updateUser(id: string, updateData: Partial<User>): Promise<User> {
    await this.userRepository.update(id, updateData);
    const updatedUser = await this.findUserById(id);
    if (!updatedUser) {
      throw new Error('User not found after update');
    }
    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.userRepository.update(id, { lastLoginAt: new Date() });
  }

  async createPatientProfile(patientData: Partial<Patient>): Promise<Patient> {
    const patient = this.patientRepository.create(patientData);
    return this.patientRepository.save(patient);
  }

  async updatePatientProfile(userId: string, updateData: Partial<Patient>): Promise<Patient> {
    const patient = await this.patientRepository.findOne({ where: { userId } });
    if (!patient) {
      throw new Error('Patient profile not found');
    }

    await this.patientRepository.update(patient.id, updateData);
    const updatedPatient = await this.patientRepository.findOne({ where: { userId } });
    if (!updatedPatient) {
      throw new Error('Patient profile not found');
    }
    return updatedPatient;
  }

  async createDoctorProfile(doctorData: Partial<Doctor>): Promise<Doctor> {
    const doctor = this.doctorRepository.create(doctorData);
    return this.doctorRepository.save(doctor);
  }

  async updateDoctorProfile(userId: string, updateData: Partial<Doctor>): Promise<Doctor> {
    const doctor = await this.doctorRepository.findOne({ where: { userId } });
    if (!doctor) {
      throw new Error('Doctor profile not found');
    }

    await this.doctorRepository.update(doctor.id, updateData);
    const updatedDoctor = await this.doctorRepository.findOne({ where: { userId } });
    if (!updatedDoctor) {
      throw new Error('Doctor profile not found');
    }
    return updatedDoctor;
  }

  async getUserStats(): Promise<{
    totalUsers: number;
    totalPatients: number;
    totalDoctors: number;
    verifiedDoctors: number;
  }> {
    const [totalUsers, totalPatients, totalDoctors, verifiedDoctors] = await Promise.all([
      this.userRepository.count(),
      this.patientRepository.count(),
      this.doctorRepository.count(),
      this.doctorRepository.count({ where: { verificationStatus: DoctorVerificationStatus.VERIFIED } }),
    ]);

    return {
      totalUsers,
      totalPatients,
      totalDoctors,
      verifiedDoctors,
    };
  }

  async findNearbyDoctors(
    latitude: number,
    longitude: number,
    radiusKm: number = 50,
    specialty?: string,
  ): Promise<Doctor[]> {
    // This would require implementing geospatial queries
    // For now, return all doctors filtered by specialty
    const queryBuilder = this.doctorRepository.createQueryBuilder('doctor')
      .leftJoinAndSelect('doctor.user', 'user')
      .where('user.status = :status', { status: 'active' });

    if (specialty) {
      queryBuilder.andWhere('doctor.specialty ILIKE :specialty', {
        specialty: `%${specialty}%`,
      });
    }

    return queryBuilder.getMany();
  }

  private applyDoctorSorting(
    queryBuilder: SelectQueryBuilder<User>,
    sortBy?: string,
    sortOrder: 'ASC' | 'DESC' = 'DESC',
  ): void {
    const order = sortOrder === 'DESC' ? 'DESC' : 'ASC';

    switch (sortBy) {
      case 'name':
        queryBuilder.orderBy('user.firstName', order).addOrderBy('user.lastName', order);
        break;
      case 'rating':
        // Assuming we have a rating field - this would need to be implemented
        queryBuilder.orderBy('doctor.averageRating', order);
        break;
      case 'experience':
        queryBuilder.orderBy('doctor.experience', order);
        break;
      case 'consultationFee':
        queryBuilder.orderBy('doctor.consultationFee', order);
        break;
      default:
        queryBuilder.orderBy('user.createdAt', order);
    }
  }
}
