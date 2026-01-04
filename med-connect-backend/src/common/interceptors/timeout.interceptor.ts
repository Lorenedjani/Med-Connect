import { Injectable, NestInterceptor, ExecutionContext, CallHandler, RequestTimeoutException } from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const requestTimeout = this.getRequestTimeout(context);

    return next.handle().pipe(
      timeout(requestTimeout),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(() => new RequestTimeoutException(`Request timeout after ${requestTimeout}ms`));
        }
        return throwError(() => err);
      }),
    );
  }

  private getRequestTimeout(context: ExecutionContext): number {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;

    // Different timeouts for different operations
    if (method === 'GET' && url.includes('/analytics')) {
      return 30000; // 30 seconds for analytics
    }

    if (method === 'POST' && url.includes('/upload')) {
      return 120000; // 2 minutes for file uploads
    }

    if (url.includes('/video') || url.includes('/call')) {
      return 300000; // 5 minutes for video calls
    }

    return 30000; // 30 seconds default
  }
}

