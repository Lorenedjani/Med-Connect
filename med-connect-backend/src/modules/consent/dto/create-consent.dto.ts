import { IsUUID, IsEnum, IsOptional, IsDateString, IsString, MinLength, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { ConsentType, ConsentPermission } from '../entities/consent.entity';

export class CreateConsentDto {
  @ApiProperty({
    description: 'ID of the doctor to grant consent to',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  doctorId: string;

  @ApiProperty({
    description: 'Type of consent',
    enum: ConsentType,
    example: ConsentType.RECORD_ACCESS,
  })
  @IsEnum(ConsentType)
  type: ConsentType;

  @ApiProperty({
    description: 'Permission level for the consent',
    enum: ConsentPermission,
    example: ConsentPermission.VIEW,
  })
  @IsEnum(ConsentPermission)
  permission: ConsentPermission;

  @ApiPropertyOptional({
    description: 'Description of the consent',
    example: 'Access to medical records for consultation',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  description?: string;

  @ApiPropertyOptional({
    description: 'Expiration date for the consent (ISO string)',
    example: '2024-12-31T23:59:59.999Z',
  })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @ApiPropertyOptional({
    description: 'Whether to grant consent immediately',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true';
    }
    return value;
  })
  grantImmediately?: boolean = false;
}

export class BulkCreateConsentDto {
  @ApiProperty({
    description: 'Array of consent creation requests',
    type: [CreateConsentDto],
  })
  consents: CreateConsentDto[];
}