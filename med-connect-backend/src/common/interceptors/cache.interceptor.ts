import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Inject } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;

    // Only cache GET requests
    if (method !== 'GET') {
      return next.handle();
    }

    const cacheKey = this.generateCacheKey(request);
    const cachedResponse = await this.cacheManager.get(cacheKey);

    if (cachedResponse) {
      return of(cachedResponse);
    }

    return next.handle().pipe(
      tap(async (response) => {
        const ttl = this.getCacheTtl(url);
        if (ttl > 0) {
          await this.cacheManager.set(cacheKey, response, ttl);
        }
      }),
    );
  }

  private generateCacheKey(request: any): string {
    const { url, user, query, params } = request;
    const userId = user?.sub || 'anonymous';
    const queryString = JSON.stringify({ ...query, ...params });

    return `cache:${userId}:${url}:${queryString}`;
  }

  private getCacheTtl(url: string): number {
    // Different cache durations for different endpoints
    if (url.includes('/analytics')) {
      return 300; // 5 minutes
    }

    if (url.includes('/users/search')) {
      return 60; // 1 minute
    }

    if (url.includes('/doctors/availability')) {
      return 30; // 30 seconds
    }

    return 60; // 1 minute default
  }
}
