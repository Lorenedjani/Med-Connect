import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorResponseDto } from '../dto/response.dto';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    console.error('Unhandled exception:', {
      message: exception.message,
      stack: exception.stack,
      url: request.url,
      method: request.method,
      user: (request as any).user?.sub || 'anonymous',
      timestamp: new Date().toISOString(),
    });

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let code = 'INTERNAL_SERVER_ERROR';

    // Handle known exception types
    if (exception.status) {
      status = exception.status;
      message = exception.message || message;
      code = this.getErrorCode(status);
    } else if (exception.name === 'ValidationError') {
      status = HttpStatus.BAD_REQUEST;
      message = 'Validation error';
      code = 'VALIDATION_ERROR';
    } else if (exception.name === 'CastError') {
      status = HttpStatus.BAD_REQUEST;
      message = 'Invalid data format';
      code = 'INVALID_DATA_FORMAT';
    } else if (exception.code === 11000) {
      status = HttpStatus.CONFLICT;
      message = 'Duplicate entry';
      code = 'DUPLICATE_ENTRY';
    }

    const errorResponse = new ErrorResponseDto(message, code);

    response.status(status).json(errorResponse);
  }

  private getErrorCode(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return 'BAD_REQUEST';
      case HttpStatus.UNAUTHORIZED:
        return 'UNAUTHORIZED';
      case HttpStatus.FORBIDDEN:
        return 'FORBIDDEN';
      case HttpStatus.NOT_FOUND:
        return 'NOT_FOUND';
      case HttpStatus.CONFLICT:
        return 'CONFLICT';
      case HttpStatus.TOO_MANY_REQUESTS:
        return 'RATE_LIMIT_EXCEEDED';
      case HttpStatus.INTERNAL_SERVER_ERROR:
        return 'INTERNAL_SERVER_ERROR';
      default:
        return 'INTERNAL_SERVER_ERROR';
    }
  }
}

