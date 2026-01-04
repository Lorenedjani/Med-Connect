import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class RevokeAccessDto {
  @ApiPropertyOptional({
    description: 'Reason for revoking access',
    example: 'No longer requiring medical services from this doctor',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  reason?: string;
}
