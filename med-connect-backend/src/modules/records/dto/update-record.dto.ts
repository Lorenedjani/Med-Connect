import { IsEnum, IsString, IsOptional, IsDateString, IsArray, ArrayMaxSize, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { RecordCategory } from '../../../common/constants/record-categories.constant';

export class UpdateRecordDto {
  @ApiPropertyOptional({
    description: 'Medical record category',
    enum: RecordCategory,
    example: RecordCategory.LAB_RESULTS,
  })
  @IsOptional()
  @IsEnum(RecordCategory)
  category?: RecordCategory;

  @ApiPropertyOptional({
    description: 'Record title',
    example: 'Updated Blood Count - January 2024',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  title?: string;

  @ApiPropertyOptional({
    description: 'Record description',
    example: 'Updated routine blood work results',
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
    example: ['blood test', 'CBC', 'updated'],
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

  @ApiPropertyOptional({
    description: 'Whether the record is active/visible',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}