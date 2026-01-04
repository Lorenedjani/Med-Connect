import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { MedicalRecord } from './medical-record.entity';

export enum DocumentType {
  ORIGINAL = 'original',
  PROCESSED = 'processed',
  THUMBNAIL = 'thumbnail',
  OCR_TEXT = 'ocr_text',
}

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  recordId: string;

  @ManyToOne(() => MedicalRecord, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recordId' })
  record: MedicalRecord;

  @Column({
    type: 'enum',
    enum: DocumentType,
    default: DocumentType.ORIGINAL,
  })
  type: DocumentType;

  @Column()
  fileName: string;

  @Column()
  fileUrl: string;

  @Column()
  mimeType: string;

  @Column()
  fileSize: number;

  @Column({ type: 'text', nullable: true })
  extractedText?: string; // OCR extracted text

  @Column({ type: 'text', nullable: true })
  metadata?: string; // JSON string with additional metadata

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual properties
  get metadataObject(): any {
    return this.metadata ? JSON.parse(this.metadata) : {};
  }

  set metadataObject(metadata: any) {
    this.metadata = JSON.stringify(metadata);
  }

  get fileSizeFormatted(): string {
    if (!this.fileSize) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = this.fileSize;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }

  get hasExtractedText(): boolean {
    return !!(this.extractedText && this.extractedText.trim().length > 0);
  }
}
