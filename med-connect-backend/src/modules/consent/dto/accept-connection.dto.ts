import { IsOptional, IsString, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class AcceptConnectionDto {
  @ApiPropertyOptional({
    description: 'Optional message when accepting the connection',
    example: 'I accept your connection request. Please let me know how I can help.',
  })
  @IsOptional()
  @IsString()
  @MinLength(5, { message: 'Message must be at least 5 characters long' })
  @Transform(({ value }) => value?.trim())
  message?: string;
}

export class RejectConnectionDto {
  @ApiPropertyOptional({
    description: 'Reason for rejecting the connection',
    example: 'I am not accepting new patients at this time.',
  })
  @IsOptional()
  @IsString()
  @MinLength(10, { message: 'Reason must be at least 10 characters long' })
  @Transform(({ value }) => value?.trim())
  reason?: string;
}

export class BlockConnectionDto {
  @ApiPropertyOptional({
    description: 'Reason for blocking the user',
    example: 'Inappropriate communication.',
  })
  @IsOptional()
  @IsString()
  @MinLength(10, { message: 'Reason must be at least 10 characters long' })
  @Transform(({ value }) => value?.trim())
  reason?: string;
}