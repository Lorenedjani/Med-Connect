import { Injectable, ValidationPipe, BadRequestException } from '@nestjs/common';

@Injectable()
export class CustomValidationPipe extends ValidationPipe {
  constructor() {
    super({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        const formattedErrors = errors.map((error) => ({
          field: error.property,
          message: Object.values(error.constraints || {}).join(', '),
          value: error.value,
        }));

        return new BadRequestException({
          success: false,
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          errors: formattedErrors,
          timestamp: new Date(),
        });
      },
    });
  }
}

