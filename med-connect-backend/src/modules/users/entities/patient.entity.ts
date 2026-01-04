import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';

@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @Column({ nullable: true })
  gender?: string;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  state?: string;

  @Column({ nullable: true })
  zipCode?: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ nullable: true })
  bloodType?: string;

  @Column({ type: 'text', nullable: true })
  allergies?: string;

  @Column({ type: 'text', nullable: true })
  currentMedications?: string;

  @Column({ type: 'text', nullable: true })
  chronicConditions?: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  height?: number; // in cm

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  weight?: number; // in kg

  @Column({ type: 'text', nullable: true })
  emergencyContactName?: string;

  @Column({ nullable: true })
  emergencyContactPhone?: string;

  @Column({ nullable: true })
  emergencyContactRelationship?: string;

  @Column({ nullable: true })
  insuranceProvider?: string;

  @Column({ nullable: true })
  insurancePolicyNumber?: string;

  @Column({ type: 'timestamp', nullable: true })
  lastPhysicalExam?: Date;

  // Virtual properties
  get fullAddress(): string {
    const parts = [this.address, this.city, this.state, this.zipCode, this.country];
    return parts.filter(Boolean).join(', ');
  }

  get bmi(): number | null {
    if (!this.height || !this.weight) return null;
    const heightInMeters = this.height / 100;
    return Math.round((this.weight / (heightInMeters * heightInMeters)) * 100) / 100;
  }
}

