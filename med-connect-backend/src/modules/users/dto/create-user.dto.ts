import { IsEmail, IsString, IsEnum, IsOptional, IsPhoneNumber, MinLength, Matches, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../../../common/constants/roles.constant';
import { Transform, Type } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @Transform(({ value }) => value?.toLowerCase()?.trim())
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'SecurePass123!',
    minLength: 8,
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    {
      message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    }
  )
  password: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  @IsString()
  @Matches(/^[a-zA-Z\s]+$/, { message: 'First name can only contain letters and spaces' })
  @Transform(({ value }) => value?.trim())
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  @IsString()
  @Matches(/^[a-zA-Z\s]+$/, { message: 'Last name can only contain letters and spaces' })
  @Transform(({ value }) => value?.trim())
  lastName: string;

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    example: UserRole.PATIENT,
  })
  @IsEnum(UserRole, { message: 'Invalid user role' })
  role: UserRole;

  @ApiPropertyOptional({
    description: 'User phone number',
    example: '+1234567890',
  })
  @IsOptional()
  @IsPhoneNumber('US', { message: 'Please provide a valid phone number' })
  phone?: string;

  @ApiPropertyOptional({
    description: 'Date of birth (for patients)',
    example: '1990-01-01',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Please provide a valid date of birth' })
  dateOfBirth?: string;

  // Doctor-specific fields
  @ApiPropertyOptional({
    description: 'Medical license number (for doctors)',
    example: 'MD123456',
  })
  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @ApiPropertyOptional({
    description: 'Medical specialty (for doctors)',
    example: 'Cardiology',
  })
  @IsOptional()
  @IsString()
  specialty?: string;

  @ApiPropertyOptional({
    description: 'Doctor bio',
    example: 'Experienced cardiologist with 10+ years of practice',
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({
    description: 'Years of experience (for doctors)',
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  experience?: number;

  @ApiPropertyOptional({
    description: 'Clinic address',
    example: '123 Medical Center Dr, City, State 12345',
  })
  @IsOptional()
  @IsString()
  clinicAddress?: string;

  @ApiPropertyOptional({
    description: 'Consultation fee in USD (for doctors)',
    example: 150.00,
  })
  @IsOptional()
  @Type(() => Number)
  consultationFee?: number;
}
