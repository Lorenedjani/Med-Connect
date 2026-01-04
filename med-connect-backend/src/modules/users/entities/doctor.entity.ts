import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { DoctorVerificationStatus } from '../../../common/constants/roles.constant';

@Entity('doctors')
export class Doctor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @Column({ unique: true })
  licenseNumber: string;

  @Column()
  specialty: string;

  @Column({
    type: 'enum',
    enum: DoctorVerificationStatus,
    default: DoctorVerificationStatus.PENDING,
  })
  verificationStatus: DoctorVerificationStatus;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ type: 'int', nullable: true })
  experience?: number; // years of experience

  @Column({ type: 'text', nullable: true })
  education?: string; // JSON string of education history

  @Column({ type: 'text', nullable: true })
  certifications?: string; // JSON string of certifications

  @Column({ type: 'text', nullable: true })
  languages?: string; // JSON string of spoken languages

  @Column({ type: 'text', nullable: true })
  clinicAddress?: string;

  @Column({ nullable: true })
  clinicCity?: string;

  @Column({ nullable: true })
  clinicState?: string;

  @Column({ nullable: true })
  clinicZipCode?: string;

  @Column({ nullable: true })
  clinicCountry?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  consultationFee?: number;

  @Column({ type: 'int', nullable: true })
  averageRating?: number;

  @Column({ type: 'int', default: 0 })
  totalReviews: number;

  @Column({ type: 'text', nullable: true })
  workingHours?: string; // JSON string of working hours

  @Column({ type: 'text', nullable: true })
  breakTimes?: string; // JSON string of break times

  @Column({ default: true })
  isAcceptingNewPatients: boolean;

  @Column({ type: 'timestamp', nullable: true })
  verifiedAt?: Date;

  // Virtual properties
  get fullClinicAddress(): string {
    const parts = [
      this.clinicAddress,
      this.clinicCity,
      this.clinicState,
      this.clinicZipCode,
      this.clinicCountry,
    ];
    return parts.filter(Boolean).join(', ');
  }

  get educationList(): any[] {
    return this.education ? JSON.parse(this.education) : [];
  }

  get certificationsList(): any[] {
    return this.certifications ? JSON.parse(this.certifications) : [];
  }

  get languagesList(): string[] {
    return this.languages ? JSON.parse(this.languages) : [];
  }

  get workingHoursObject(): any {
    return this.workingHours ? JSON.parse(this.workingHours) : {};
  }

  get breakTimesList(): any[] {
    return this.breakTimes ? JSON.parse(this.breakTimes) : [];
  }
}

