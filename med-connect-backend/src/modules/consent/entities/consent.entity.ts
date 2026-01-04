import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum ConsentStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  REVOKED = 'revoked',
  EXPIRED = 'expired',
}

export enum ConsentType {
  RECORD_ACCESS = 'record_access',
  EMERGENCY_ACCESS = 'emergency_access',
  TEMPORARY_ACCESS = 'temporary_access',
}

export enum ConsentPermission {
  VIEW = 'view',
  DOWNLOAD = 'download',
  FULL_ACCESS = 'full_access',
}

@Entity('consents')
export class Consent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  patientId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'patientId' })
  patient: User;

  @Column()
  doctorId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'doctorId' })
  doctor: User;

  @Column({
    type: 'enum',
    enum: ConsentType,
    default: ConsentType.RECORD_ACCESS,
  })
  type: ConsentType;

  @Column({
    type: 'enum',
    enum: ConsentStatus,
    default: ConsentStatus.PENDING,
  })
  status: ConsentStatus;

  @Column({
    type: 'enum',
    enum: ConsentPermission,
    default: ConsentPermission.VIEW,
  })
  permission: ConsentPermission;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt?: Date;

  @Column({ type: 'text', nullable: true })
  grantedById?: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'grantedById' })
  grantedBy?: User;

  @Column({ type: 'timestamp', nullable: true })
  grantedAt?: Date;

  @Column({ type: 'text', nullable: true })
  revokedById?: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'revokedById' })
  revokedBy?: User;

  @Column({ type: 'timestamp', nullable: true })
  revokedAt?: Date;

  @Column({ type: 'text', nullable: true })
  revokeReason?: string;

  @OneToMany('AccessLog', 'consent')
  accessLogs: AccessLog[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual properties
  get isActive(): boolean {
    return this.status === ConsentStatus.ACTIVE &&
           (!this.expiresAt || this.expiresAt > new Date());
  }

  get isExpired(): boolean {
    return this.expiresAt ? this.expiresAt <= new Date() : false;
  }
}

// Forward declaration
export class AccessLog {}