import { IsOptional, IsString, IsEnum, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../../../common/constants/roles.constant';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { Transform, Type } from 'class-transformer';

export class SearchUsersDto extends PaginationDto {

  @ApiPropertyOptional({
    description: 'Filter by user role',
    enum: UserRole,
    example: UserRole.DOCTOR,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Invalid user role' })
  role?: UserRole;

  @ApiPropertyOptional({
    description: 'Filter by specialty (for doctors)',
    example: 'Cardiology',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  specialty?: string;

  @ApiPropertyOptional({
    description: 'Filter by city',
    example: 'New York',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  city?: string;

  @ApiPropertyOptional({
    description: 'Filter by state',
    example: 'NY',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  state?: string;

  @ApiPropertyOptional({
    description: 'Filter doctors who are accepting new patients',
    example: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  acceptingNewPatients?: boolean;

  @ApiPropertyOptional({
    description: 'Sort by field',
    example: 'rating',
    enum: ['name', 'rating', 'experience', 'consultationFee', 'createdAt'],
  })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    description: 'Sort order',
    example: 'DESC',
    enum: ['ASC', 'DESC'],
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
