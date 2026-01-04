import { IsEnum, IsOptional, IsString, IsDateString, IsArray, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { RecordCategory } from '../../../common/constants/record-categories.constant';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class FilterRecordsDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Filter by record category',
    enum: RecordCategory,
    example: RecordCategory.LAB_RESULTS,
  })
  @IsOptional()
  @IsEnum(RecordCategory)
  category?: RecordCategory;

  @ApiPropertyOptional({
    description: 'Filter by tags',
    example: ['blood', 'test'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value.map(tag => tag.trim().toLowerCase()).filter(tag => tag.length > 0);
    }
    return value;
  })
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Filter by record date from',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiPropertyOptional({
    description: 'Filter by record date to',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @ApiPropertyOptional({
    description: 'Filter by creation date from',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDateString()
  createdFrom?: string;

  @ApiPropertyOptional({
    description: 'Filter by creation date to',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsDateString()
  createdTo?: string;

  @ApiPropertyOptional({
    description: 'Include inactive records',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return value;
  })
  includeInactive?: boolean = false;

  @ApiPropertyOptional({
    description: 'Sort by specific field',
    example: 'recordDate',
    enum: ['title', 'category', 'recordDate', 'createdAt', 'fileSize'],
  })
  @IsOptional()
  @IsString()
  sortBy?: 'title' | 'category' | 'recordDate' | 'createdAt' | 'fileSize' = 'createdAt';
}