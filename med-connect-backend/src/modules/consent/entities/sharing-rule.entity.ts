import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { RecordCategory } from '../../../common/constants/record-categories.constant';

export enum SharingRuleType {
  CATEGORY_BASED = 'category_based',
  RECORD_BASED = 'record_based',
  TIME_BASED = 'time_based',
  CONDITIONAL = 'conditional',
}

export enum SharingRuleStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  EXPIRED = 'expired',
}

@Entity('sharing_rules')
export class SharingRule {
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
    enum: SharingRuleType,
  })
  type: SharingRuleType;

  @Column({
    type: 'enum',
    enum: SharingRuleStatus,
    default: SharingRuleStatus.ACTIVE,
  })
  status: SharingRuleStatus;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'json', nullable: true })
  conditions?: {
    categories?: RecordCategory[];
    recordIds?: string[];
    dateRange?: {
      start: Date;
      end: Date;
    };
    customConditions?: any;
  };

  @Column({ type: 'json', nullable: true })
  permissions?: {
    canView: boolean;
    canDownload: boolean;
    canShare: boolean;
    canEdit: boolean;
  };

  @Column({ type: 'timestamp', nullable: true })
  expiresAt?: Date;

  @Column({ type: 'text', nullable: true })
  createdById?: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdById' })
  createdBy?: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual properties
  get isActive(): boolean {
    return this.status === SharingRuleStatus.ACTIVE &&
           (!this.expiresAt || this.expiresAt > new Date());
  }

  get isExpired(): boolean {
    return this.status === SharingRuleStatus.EXPIRED ||
           (this.expiresAt ? this.expiresAt <= new Date() : false);
  }
}