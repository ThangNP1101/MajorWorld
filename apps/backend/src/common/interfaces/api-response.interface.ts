/**
 * Standardized API Response Format
 * 
 * This interface ensures consistency across all API responses.
 * Both success and error responses follow the same structure.
 */

/**
 * Success response structure
 * @template T - Type of the data being returned
 */
export interface ApiSuccessResponse<T = any> {
  success: true;
  message: string;
  data: T;
}

/**
 * Error response structure
 */
export interface ApiErrorResponse {
  success: false;
  message: string;
  data: null;
  error?: string | string[] | Record<string, any>;
}

/**
 * Union type for all API responses
 */
export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;
