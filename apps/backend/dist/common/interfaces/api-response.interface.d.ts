export interface ApiSuccessResponse<T = any> {
    success: true;
    message: string;
    data: T;
}
export interface ApiErrorResponse {
    success: false;
    message: string;
    data: null;
    error?: string | string[] | Record<string, any>;
}
export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;
