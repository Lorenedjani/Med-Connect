import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum ConnectionStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  BLOCKED = 'blocked',
}

export enum ConnectionType {
  DOCTOR_PATIENT = 'doctor_patient',
  FAMILY_MEMBER = 'family_member',
  CARETAKER = 'caretaker',
  EMERGENCY_CONTACT = 'emergency_contact',
}

@Entity('connections')
@Unique(['requesterId', 'targetId'])
export class Connection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  requesterId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'requesterId' })
  requester: User;

  @Column()
  targetId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'targetId' })
  target: User;

  @Column({
    type: 'enum',
    enum: ConnectionType,
    default: ConnectionType.DOCTOR_PATIENT,
  })
  type: ConnectionType;

  @Column({
    type: 'enum',
    enum: ConnectionStatus,
    default: ConnectionStatus.PENDING,
  })
  status: ConnectionStatus;

  @Column({ type: 'text', nullable: true })
  message?: string;

  @Column({ type: 'text', nullable: true })
  acceptedById?: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'acceptedById' })
  acceptedBy?: User;

  @Column({ type: 'timestamp', nullable: true })
  acceptedAt?: Date;

  @Column({ type: 'text', nullable: true })
  rejectedById?: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'rejectedById' })
  rejectedBy?: User;

  @Column({ type: 'timestamp', nullable: true })
  rejectedAt?: Date;

  @Column({ type: 'text', nullable: true })
  rejectReason?: string;

  @Column({ type: 'text', nullable: true })
  blockedById?: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'blockedById' })
  blockedBy?: User;

  @Column({ type: 'timestamp', nullable: true })
  blockedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual properties
  get isActive(): boolean {
    return this.status === ConnectionStatus.ACCEPTED;
  }

  get canCommunicate(): boolean {
    return this.status === ConnectionStatus.ACCEPTED;
  }

  get otherUserId(): string {
    // Helper method to get the other user's ID
    // This would be called with the current user's ID as context
    return '';
  }
}