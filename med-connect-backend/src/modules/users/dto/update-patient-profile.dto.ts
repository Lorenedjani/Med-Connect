import { IsOptional, IsString, IsEnum, IsNumber, Min, Max, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say',
}

export class UpdatePatientProfileDto {
  @ApiPropertyOptional({
    description: 'Patient gender',
    enum: Gender,
    example: Gender.MALE,
  })
  @IsOptional()
  @IsEnum(Gender, { message: 'Invalid gender value' })
  gender?: Gender;

  @ApiPropertyOptional({
    description: 'Emergency contact name',
    example: 'Jane Doe',
  })
  @IsOptional()
  @IsString()
  emergencyContactName?: string;

  @ApiPropertyOptional({
    description: 'Emergency contact phone',
    example: '+1234567890',
  })
  @IsOptional()
  @IsString()
  emergencyContactPhone?: string;

  @ApiPropertyOptional({
    description: 'Emergency contact relationship',
    example: 'Spouse',
  })
  @IsOptional()
  @IsString()
  emergencyContactRelationship?: string;

  @ApiPropertyOptional({
    description: 'Blood type',
    example: 'O+',
  })
  @IsOptional()
  @IsString()
  bloodType?: string;

  @ApiPropertyOptional({
    description: 'Allergies (comma-separated)',
    example: 'Penicillin, Peanuts',
  })
  @IsOptional()
  @IsString()
  allergies?: string;

  @ApiPropertyOptional({
    description: 'Current medications (comma-separated)',
    example: 'Lisinopril 10mg, Metformin 500mg',
  })
  @IsOptional()
  @IsString()
  currentMedications?: string;

  @ApiPropertyOptional({
    description: 'Chronic conditions (comma-separated)',
    example: 'Hypertension, Diabetes',
  })
  @IsOptional()
  @IsString()
  chronicConditions?: string;

  @ApiPropertyOptional({
    description: 'Height in centimeters',
    example: 175,
    minimum: 50,
    maximum: 250,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(50, { message: 'Height must be at least 50 cm' })
  @Max(250, { message: 'Height must be at most 250 cm' })
  height?: number;

  @ApiPropertyOptional({
    description: 'Weight in kilograms',
    example: 70,
    minimum: 20,
    maximum: 300,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(20, { message: 'Weight must be at least 20 kg' })
  @Max(300, { message: 'Weight must be at most 300 kg' })
  weight?: number;

  @ApiPropertyOptional({
    description: 'Insurance provider',
    example: 'Blue Cross Blue Shield',
  })
  @IsOptional()
  @IsString()
  insuranceProvider?: string;

  @ApiPropertyOptional({
    description: 'Insurance policy number',
    example: 'ABC123456789',
  })
  @IsOptional()
  @IsString()
  insurancePolicyNumber?: string;

  @ApiPropertyOptional({
    description: 'Last physical exam date',
    example: '2023-06-15',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Please provide a valid date' })
  lastPhysicalExam?: string;

  @ApiPropertyOptional({
    description: 'Address',
    example: '123 Main St, Apt 4B',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    description: 'City',
    example: 'New York',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    description: 'State',
    example: 'NY',
  })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({
    description: 'ZIP code',
    example: '10001',
  })
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiPropertyOptional({
    description: 'Country',
    example: 'USA',
  })
  @IsOptional()
  @IsString()
  country?: string;
}
