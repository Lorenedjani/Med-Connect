import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException } from '@nestjs/common';
import { Response } from 'express';
import { ValidationErrorResponseDto } from '../dto/response.dto';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const exceptionResponse = exception.getResponse();

    let message = 'Validation failed';
    let errors: Array<{ field: string; message: string }> = [];

    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const responseObj = exceptionResponse as any;

      if (responseObj.errors) {
        // Already formatted errors
        errors = responseObj.errors;
        message = responseObj.message || message;
      } else if (responseObj.message) {
        message = Array.isArray(responseObj.message)
          ? responseObj.message.join(', ')
          : responseObj.message;
      }
    }

    const errorResponse = new ValidationErrorResponseDto(message, errors);
    response.status(400).json(errorResponse);
  }
}

