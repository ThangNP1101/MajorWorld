import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  StreamableFile,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ApiSuccessResponse } from "../interfaces/api-response.interface";

/**
 * Check if the value is already in the standardized API response format
 */
function isApiResponse(value: unknown): value is ApiSuccessResponse<unknown> {
  if (!value || typeof value !== "object") {
    return false;
  }
  return "success" in value && "message" in value && "data" in value;
}

/**
 * Global Response Transform Interceptor
 * 
 * Transforms all successful responses to a standardized format.
 * This ensures consistency across all API responses.
 */
@Injectable()
export class ResponseTransformInterceptor
  implements NestInterceptor
{
  intercept(
    _context: ExecutionContext,
    next: CallHandler
  ): Observable<ApiSuccessResponse<unknown> | StreamableFile> {
    return next.handle().pipe(
      map((data) => {
        // Don't wrap file streams
        if (data instanceof StreamableFile) {
          return data;
        }
        
        // If already in standardized format, return as-is
        if (isApiResponse(data)) {
          return data;
        }
        
        // Transform to standardized success response
        return {
          success: true as const,
          message: "Request Success",
          data,
        };
      })
    );
  }
}
