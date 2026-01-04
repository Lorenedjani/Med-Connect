import { IsOptional, IsString, MinLength, IsArray, ArrayMaxSize, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class GrantAccessDto {
  @ApiPropertyOptional({
    description: 'Optional message when granting access',
    example: 'I have granted you access to my medical records.',
  })
  @IsOptional()
  @IsString()
  @MinLength(5, { message: 'Message must be at least 5 characters long' })
  @Transform(({ value }) => value?.trim())
  message?: string;

  @ApiPropertyOptional({
    description: 'Specific record IDs to grant access to (leave empty for all records)',
    example: ['123e4567-e89b-12d3-a456-426614174001', '123e4567-e89b-12d3-a456-426614174002'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  @ArrayMaxSize(50, { message: 'Cannot grant access to more than 50 records at once' })
  recordIds?: string[];
}

export class RevokeAccessDto {
  @ApiPropertyOptional({
    description: 'Reason for revoking access',
    example: 'Consultation completed, no longer need access.',
  })
  @IsOptional()
  @IsString()
  @MinLength(10, { message: 'Reason must be at least 10 characters long' })
  @Transform(({ value }) => value?.trim())
  reason?: string;

  @ApiPropertyOptional({
    description: 'Specific record IDs to revoke access from (leave empty to revoke all access)',
    example: ['123e4567-e89b-12d3-a456-426614174001'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  @ArrayMaxSize(50, { message: 'Cannot revoke access from more than 50 records at once' })
  recordIds?: string[];
}