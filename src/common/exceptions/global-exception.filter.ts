import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from 'generated/prisma';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string = 'Internal server error';
    let errors: unknown = null;

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      status = HttpStatus.BAD_REQUEST;

      const dto = request.body as Record<string, unknown>;
      const target = exception.meta?.target?.[0] as string;
      const value = dto?.[target] as string;

      switch (exception.code) {
        case 'P2002':
          message = `${target} already exists with value: ${value}`;
          break;
        case 'P2003':
          message = `Foreign key constraint failed on field: ${exception.meta?.field_name as string}`;
          break;
        default:
          message = exception.message;
      }

      return response.status(status).json({
        success: false,
        message,
        errors: errors ?? exception,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const responseObj = exceptionResponse as Record<string, unknown>;

        if (Array.isArray(responseObj.message)) {
          message = 'Validation failed';
          errors = responseObj.message;
        } else if (typeof responseObj.message === 'string') {
          // Single string message (custom exceptions)
          message = responseObj.message;
          if (responseObj.errors) errors = responseObj.errors;
        } else if (typeof responseObj.error === 'string') {
          // Fallback to error field
          message = responseObj.error;
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      // Log unexpected errors in production
      console.error('Unexpected error:', exception);
    }

    response.status(status).json({
      success: false,
      message,
      errors,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
