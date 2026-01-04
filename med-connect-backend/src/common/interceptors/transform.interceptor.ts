import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SuccessResponseDto } from '../dto/response.dto';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, SuccessResponseDto<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<SuccessResponseDto<T>> {
    return next.handle().pipe(
      map((data) => {
        // If data is already a response object, return as-is
        if (data && typeof data === 'object' && 'success' in data) {
          return data;
        }

        // Wrap the response in our standard format
        const message = this.getSuccessMessage(context);
        return new SuccessResponseDto(message, data);
      }),
    );
  }

  private getSuccessMessage(context: ExecutionContext): string {
    const { method, url } = context.switchToHttp().getRequest();

    switch (method) {
      case 'GET':
        return 'Data retrieved successfully';
      case 'POST':
        return 'Resource created successfully';
      case 'PUT':
      case 'PATCH':
        return 'Resource updated successfully';
      case 'DELETE':
        return 'Resource deleted successfully';
      default:
        return 'Operation completed successfully';
    }
  }
}

