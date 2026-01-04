import { IsUUID, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { ConnectionType } from '../entities/connection.entity';

export class CreateConnectionRequestDto {
  @ApiProperty({
    description: 'ID of the user to connect with',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  targetUserId: string;

  @ApiProperty({
    description: 'Type of connection',
    enum: ConnectionType,
    example: ConnectionType.DOCTOR_PATIENT,
  })
  @IsEnum(ConnectionType)
  type: ConnectionType;

  @ApiPropertyOptional({
    description: 'Optional message to the target user',
    example: 'I would like to request access to your medical records for consultation.',
  })
  @IsOptional()
  @IsString()
  @MinLength(10, { message: 'Message must be at least 10 characters long' })
  @Transform(({ value }) => value?.trim())
  message?: string;
}

export class UpdateConnectionRequestDto {
  @ApiPropertyOptional({
    description: 'Updated message for the connection request',
    example: 'Updated request message with more details.',
  })
  @IsOptional()
  @IsString()
  @MinLength(10, { message: 'Message must be at least 10 characters long' })
  @Transform(({ value }) => value?.trim())
  message?: string;
}