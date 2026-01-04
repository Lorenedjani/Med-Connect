import { IsUUID, IsOptional, IsDateString, IsString, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export enum SharePermission {
  VIEW = 'view',
  DOWNLOAD = 'download',
  FULL_ACCESS = 'full_access',
}

export class ShareRecordDto {
  @ApiProperty({
    description: 'ID of the user to share the record with',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'Permission level for the shared record',
    enum: SharePermission,
    example: SharePermission.VIEW,
  })
  @IsEnum(SharePermission)
  permission: SharePermission;

  @ApiPropertyOptional({
    description: 'Expiration date for the share (optional)',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @ApiPropertyOptional({
    description: 'Optional message to the recipient',
    example: 'Please review these lab results',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  message?: string;
}

export class RevokeShareDto {
  @ApiProperty({
    description: 'ID of the user to revoke access from',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  userId: string;
}

export class SharedRecordAccessDto {
  @ApiProperty({
    description: 'Record ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  recordId: string;

  @ApiProperty({
    description: 'Permission granted',
    enum: SharePermission,
    example: SharePermission.VIEW,
  })
  permission: SharePermission;

  @ApiProperty({
    description: 'When the share was granted',
  })
  grantedAt: Date;

  @ApiPropertyOptional({
    description: 'When the share expires',
  })
  expiresAt?: Date;

  @ApiPropertyOptional({
    description: 'Message from the sharer',
  })
  message?: string;
}