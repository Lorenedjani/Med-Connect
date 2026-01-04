import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseDto<T = any> {
  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  success: boolean = true;

  @ApiProperty({
    description: 'Response message',
    example: 'Operation completed successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Response data',
  })
  data?: T;

  @ApiProperty({
    description: 'Response timestamp',
    example: '2024-01-04T12:00:00.000Z',
  })
  timestamp: Date;

  constructor(message: string = 'Success', data?: T) {
    this.message = message;
    this.data = data;
    this.timestamp = new Date();
  }
}

export class ErrorResponseDto {
  @ApiProperty({
    description: 'Success status',
    example: false,
  })
  success: boolean = false;

  @ApiProperty({
    description: 'Error message',
    example: 'An error occurred',
  })
  message: string;

  @ApiProperty({
    description: 'Error code',
    example: 'INTERNAL_SERVER_ERROR',
  })
  code?: string;

  @ApiProperty({
    description: 'Error details',
  })
  details?: any;

  @ApiProperty({
    description: 'Response timestamp',
    example: '2024-01-04T12:00:00.000Z',
  })
  timestamp: Date;

  constructor(message: string, code?: string, details?: any) {
    this.message = message;
    this.code = code;
    this.details = details;
    this.timestamp = new Date();
  }
}

export class ValidationErrorResponseDto extends ErrorResponseDto {
  @ApiProperty({
    description: 'Validation errors',
    example: [
      {
        field: 'email',
        message: 'Email is required',
      },
    ],
  })
  errors: Array<{
    field: string;
    message: string;
  }>;

  constructor(
    message: string,
    errors: Array<{ field: string; message: string }>,
  ) {
    super(message, 'VALIDATION_ERROR');
    this.errors = errors;
  }
}

