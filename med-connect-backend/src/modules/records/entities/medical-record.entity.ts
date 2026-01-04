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
import { RecordCategory, RecordType } from '../../../common/constants/record-categories.constant';

@Entity('medical_records')
export class MedicalRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  patientId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'patientId' })
  patient: User;

  @Column({
    type: 'enum',
    enum: RecordCategory,
  })
  category: RecordCategory;

  @Column({ nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: RecordType,
  })
  type: RecordType;

  @Column()
  fileName: string;

  @Column()
  originalFileName: string;

  @Column()
  fileSize: number;

  @Column()
  mimeType: string;

  @Column()
  fileUrl: string;

  @Column({ nullable: true })
  fileKey?: string; // For cloud storage

  @Column({ type: 'date', nullable: true })
  recordDate?: Date;

  @Column({ type: 'text', nullable: true })
  tags?: string; // JSON string of tags

  @Column({ default: false })
  isEncrypted: boolean;

  @Column({ type: 'text', nullable: true })
  encryptionKey?: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  uploadedById: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'uploadedById' })
  uploadedBy: User;

  @OneToMany('RecordVersion', 'record')
  versions: RecordVersion[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual properties
  get tagsList(): string[] {
    return this.tags ? JSON.parse(this.tags) : [];
  }

  set tagsList(tags: string[]) {
    this.tags = JSON.stringify(tags);
  }

  get fileSizeFormatted(): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = this.fileSize;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }
}

// Forward declaration for RecordVersion
export class RecordVersion {}