import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Consent } from './consent.entity';
import { User } from '../../users/entities/user.entity';

export enum AccessAction {
  VIEW = 'view',
  DOWNLOAD = 'download',
  SHARE = 'share',
  MODIFY = 'modify',
  DELETE = 'delete',
}

export enum AccessResult {
  SUCCESS = 'success',
  DENIED = 'denied',
  ERROR = 'error',
}

@Entity('access_logs')
@Index(['userId', 'recordId'])
@Index(['consentId', 'accessedAt'])
export class AccessLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  recordId: string;

  @Column({ nullable: true })
  consentId?: string;

  @ManyToOne(() => Consent)
  @JoinColumn({ name: 'consentId' })
  consent?: Consent;

  @Column({
    type: 'enum',
    enum: AccessAction,
  })
  action: AccessAction;

  @Column({
    type: 'enum',
    enum: AccessResult,
    default: AccessResult.SUCCESS,
  })
  result: AccessResult;

  @Column({ type: 'text', nullable: true })
  details?: string;

  @Column({ type: 'json', nullable: true })
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    location?: string;
    deviceInfo?: any;
  };

  @Column({ type: 'timestamp', nullable: true })
  accessedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}