import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiErrorResponse } from '../interfaces/api-response.interface';

/**
 * Global HTTP Exception Filter
 * 
 * Transforms all HTTP exceptions to a standardized error response format.
 * This ensures consistency across all error responses in the API.
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message: string;
    let error: string | string[] | Record<string, any> | undefined;

    // Parse exception response
    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const res = exceptionResponse as Record<string, any>;
      message = res.message || exception.message || 'An error occurred';
      error = res.error;
      
      // Handle validation errors (array of messages from class-validator)
      if (Array.isArray(res.message)) {
        error = res.message;
        message = 'Validation failed';
      }
    } else {
      message = exception.message || 'An error occurred';
    }

    // Build standardized error response
    const errorResponse: ApiErrorResponse = {
      success: false,
      message,
      data: null,
    };

    // Add error details if available
    if (error !== undefined) {
      errorResponse.error = error;
    }

    // Log error for debugging
    this.logger.error(
      `HTTP ${status} Error: ${message} | Path: ${request.url} | Method: ${request.method}`
    );

    response.status(status).json(errorResponse);
  }
}
