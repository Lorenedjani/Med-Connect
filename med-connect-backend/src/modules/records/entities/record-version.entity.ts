import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { MedicalRecord } from './medical-record.entity';

@Entity('record_versions')
export class RecordVersion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  recordId: string;

  @ManyToOne(() => MedicalRecord, (record) => record.versions)
  @JoinColumn({ name: 'recordId' })
  record: MedicalRecord;

  @Column()
  versionNumber: number;

  @Column()
  fileName: string;

  @Column()
  fileSize: number;

  @Column()
  mimeType: string;

  @Column()
  fileUrl: string;

  @Column({ nullable: true })
  fileKey?: string;

  @Column({ type: 'text', nullable: true })
  changeLog?: string;

  @Column({ nullable: true })
  createdById: string;

  @CreateDateColumn()
  createdAt: Date;
}