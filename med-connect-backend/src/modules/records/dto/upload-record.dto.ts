import { IsEnum, IsString, IsOptional, IsDateString, IsArray, ArrayMaxSize } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { RecordCategory } from '../../../common/constants/record-categories.constant';

export class UploadRecordDto {
  @ApiProperty({
    description: 'Medical record category',
    enum: RecordCategory,
    example: RecordCategory.LAB_RESULTS,
  })
  @IsEnum(RecordCategory)
  category: RecordCategory;

  @ApiProperty({
    description: 'Record title',
    example: 'Complete Blood Count - January 2024',
  })
  @IsString()
  @Transform(({ value }) => value?.trim())
  title: string;

  @ApiPropertyOptional({
    description: 'Record description',
    example: 'Routine blood work showing normal results',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  description?: string;

  @ApiPropertyOptional({
    description: 'Date when the record was created',
    example: '2024-01-15',
  })
  @IsOptional()
  @IsDateString()
  recordDate?: string;

  @ApiPropertyOptional({
    description: 'Tags for categorization and search',
    example: ['blood test', 'CBC', 'routine'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(10)
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value.map(tag => tag.trim().toLowerCase()).filter(tag => tag.length > 0);
    }
    return value;
  })
  tags?: string[];
}

export class UploadRecordResponseDto {
  @ApiProperty({
    description: 'Upload URL for the file',
    example: 'https://api.med-connect.com/upload/record-123',
  })
  uploadUrl: string;

  @ApiProperty({
    description: 'Upload fields required for the request',
    example: {
      key: 'records/patient-123/record-456.pdf',
      'Content-Type': 'application/pdf',
      'x-amz-algorithm': 'AWS4-HMAC-SHA256',
    },
  })
  fields: Record<string, string>;

  @ApiProperty({
    description: 'Record ID that will be created',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  recordId: string;

  @ApiProperty({
    description: 'Expiration time for the upload URL',
    example: '2024-01-04T14:30:00.000Z',
  })
  expiresAt: Date;
}