import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppResponse } from '../interfaces/api-response.interface';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<unknown, AppResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<unknown>,
  ): Observable<AppResponse<T>> {
    return next.handle().pipe(
      map((data: unknown) => {
        const response = context.switchToHttp().getResponse<Response>();
        const statusCode = response.statusCode;

        if (data && typeof data === 'object' && 'success' in data) {
          return data as AppResponse<T>;
        }

        return {
          success: true,
          statusCode,
          message: 'Operation successful',
          data: data as T,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
