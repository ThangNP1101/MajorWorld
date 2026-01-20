import { NestInterceptor, ExecutionContext, CallHandler, StreamableFile } from "@nestjs/common";
import { Observable } from "rxjs";
import { ApiSuccessResponse } from "../interfaces/api-response.interface";
export declare class ResponseTransformInterceptor implements NestInterceptor {
    intercept(_context: ExecutionContext, next: CallHandler): Observable<ApiSuccessResponse<unknown> | StreamableFile>;
}
