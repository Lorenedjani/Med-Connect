import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RecordCategory, RecordType } from '../../../common/constants/record-categories.constant';

export class RecordMetadataDto {
  @ApiProperty({
    description: 'Record ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Patient ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  patientId: string;

  @ApiProperty({
    description: 'Record category',
    enum: RecordCategory,
    example: RecordCategory.LAB_RESULTS,
  })
  category: RecordCategory;

  @ApiProperty({
    description: 'Record title',
    example: 'Complete Blood Count - January 2024',
  })
  title: string;

  @ApiPropertyOptional({
    description: 'Record description',
  })
  description?: string;

  @ApiProperty({
    description: 'Record type',
    enum: RecordType,
    example: RecordType.PDF,
  })
  type: RecordType;

  @ApiProperty({
    description: 'File name',
    example: 'blood_test_jan_2024.pdf',
  })
  fileName: string;

  @ApiProperty({
    description: 'Original file name',
    example: 'CBC_Results.pdf',
  })
  originalFileName: string;

  @ApiProperty({
    description: 'File size in bytes',
    example: 2048576,
  })
  fileSize: number;

  @ApiProperty({
    description: 'Formatted file size',
    example: '2.0 MB',
  })
  fileSizeFormatted: string;

  @ApiProperty({
    description: 'File MIME type',
    example: 'application/pdf',
  })
  mimeType: string;

  @ApiProperty({
    description: 'File URL for download',
    example: 'https://storage.med-connect.com/records/patient-123/record-456.pdf',
  })
  fileUrl: string;

  @ApiPropertyOptional({
    description: 'Date of the medical record',
  })
  recordDate?: Date;

  @ApiPropertyOptional({
    description: 'Tags associated with the record',
    type: [String],
  })
  tags?: string[];

  @ApiProperty({
    description: 'Whether the record is encrypted',
    example: true,
  })
  isEncrypted: boolean;

  @ApiProperty({
    description: 'Whether the record is active',
    example: true,
  })
  isActive: boolean;

  @ApiPropertyOptional({
    description: 'ID of user who uploaded the record',
  })
  uploadedById?: string;

  @ApiProperty({
    description: 'Record creation date',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Record last update date',
  })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'AI analysis summary',
  })
  aiSummary?: string;

  @ApiPropertyOptional({
    description: 'OCR extracted text preview',
  })
  ocrText?: string;
}

export class RecordListItemDto {
  @ApiProperty({
    description: 'Record ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Record title',
    example: 'Complete Blood Count - January 2024',
  })
  title: string;

  @ApiProperty({
    description: 'Record category',
    enum: RecordCategory,
    example: RecordCategory.LAB_RESULTS,
  })
  category: RecordCategory;

  @ApiProperty({
    description: 'File size in bytes',
    example: 2048576,
  })
  fileSize: number;

  @ApiProperty({
    description: 'Formatted file size',
    example: '2.0 MB',
  })
  fileSizeFormatted: string;

  @ApiPropertyOptional({
    description: 'Date of the medical record',
  })
  recordDate?: Date;

  @ApiProperty({
    description: 'Record creation date',
  })
  createdAt: Date;

  @ApiPropertyOptional({
    description: 'Tags associated with the record',
    type: [String],
  })
  tags?: string[];
}