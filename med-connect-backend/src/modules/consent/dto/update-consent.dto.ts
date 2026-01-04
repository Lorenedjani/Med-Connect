import { IsEnum, IsOptional, IsDateString, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { ConsentStatus, ConsentPermission } from '../entities/consent.entity';

export class UpdateConsentDto {
  @ApiPropertyOptional({
    description: 'Update the consent status',
    enum: ConsentStatus,
    example: ConsentStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(ConsentStatus)
  status?: ConsentStatus;

  @ApiPropertyOptional({
    description: 'Update the permission level',
    enum: ConsentPermission,
    example: ConsentPermission.DOWNLOAD,
  })
  @IsOptional()
  @IsEnum(ConsentPermission)
  permission?: ConsentPermission;

  @ApiPropertyOptional({
    description: 'Update the description',
    example: 'Updated access for follow-up consultation',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  description?: string;

  @ApiPropertyOptional({
    description: 'Update the expiration date',
    example: '2025-12-31T23:59:59.999Z',
  })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}