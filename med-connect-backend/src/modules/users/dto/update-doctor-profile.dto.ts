import { IsOptional, IsString, IsNumber, Min, Max, IsEnum, IsUrl } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { DoctorVerificationStatus } from '../../../common/constants/roles.constant';

export class UpdateDoctorProfileDto {
  @ApiPropertyOptional({
    description: 'Doctor bio',
    example: 'Experienced cardiologist with 10+ years of practice',
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({
    description: 'Years of experience',
    example: 10,
    minimum: 0,
    maximum: 50,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0, { message: 'Experience cannot be negative' })
  @Max(50, { message: 'Experience cannot exceed 50 years' })
  experience?: number;

  @ApiPropertyOptional({
    description: 'Education history (JSON string)',
    example: '[{"institution": "Harvard Medical School", "degree": "MD", "year": 2010}]',
  })
  @IsOptional()
  @IsString()
  education?: string;

  @ApiPropertyOptional({
    description: 'Certifications (JSON string)',
    example: '[{"name": "Board Certified Cardiologist", "issuer": "ABIM", "issueDate": "2015-01-01", "expiryDate": "2025-01-01"}]',
  })
  @IsOptional()
  @IsString()
  certifications?: string;

  @ApiPropertyOptional({
    description: 'Spoken languages (JSON string)',
    example: '["English", "Spanish", "French"]',
  })
  @IsOptional()
  @IsString()
  languages?: string;

  @ApiPropertyOptional({
    description: 'Clinic address',
    example: '123 Medical Center Dr, Suite 200',
  })
  @IsOptional()
  @IsString()
  clinicAddress?: string;

  @ApiPropertyOptional({
    description: 'Clinic city',
    example: 'New York',
  })
  @IsOptional()
  @IsString()
  clinicCity?: string;

  @ApiPropertyOptional({
    description: 'Clinic state',
    example: 'NY',
  })
  @IsOptional()
  @IsString()
  clinicState?: string;

  @ApiPropertyOptional({
    description: 'Clinic ZIP code',
    example: '10001',
  })
  @IsOptional()
  @IsString()
  clinicZipCode?: string;

  @ApiPropertyOptional({
    description: 'Clinic country',
    example: 'USA',
  })
  @IsOptional()
  @IsString()
  clinicCountry?: string;

  @ApiPropertyOptional({
    description: 'Consultation fee in USD',
    example: 150.00,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0, { message: 'Consultation fee cannot be negative' })
  consultationFee?: number;

  @ApiPropertyOptional({
    description: 'Working hours (JSON string)',
    example: '{"monday": {"start": "09:00", "end": "17:00"}, "tuesday": {"start": "09:00", "end": "17:00"}}',
  })
  @IsOptional()
  @IsString()
  workingHours?: string;

  @ApiPropertyOptional({
    description: 'Break times (JSON string)',
    example: '[{"start": "12:00", "end": "13:00"}]',
  })
  @IsOptional()
  @IsString()
  breakTimes?: string;

  @ApiPropertyOptional({
    description: 'Is accepting new patients',
    example: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  isAcceptingNewPatients?: boolean;

  @ApiPropertyOptional({
    description: 'Website URL',
    example: 'https://drjohndoe.com',
  })
  @IsOptional()
  @IsUrl({}, { message: 'Please provide a valid website URL' })
  website?: string;

  @ApiPropertyOptional({
    description: 'Social media links (JSON string)',
    example: '{"linkedin": "https://linkedin.com/in/drjohndoe", "twitter": "https://twitter.com/drjohndoe"}',
  })
  @IsOptional()
  @IsString()
  socialMedia?: string;
}
