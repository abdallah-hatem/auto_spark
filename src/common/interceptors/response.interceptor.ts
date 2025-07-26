import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseUtil } from '../utils/response.util';
import { ApiResponse } from '../interfaces/api-response.interface';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    
    return next.handle().pipe(
      map((data) => {
        // If the response is already wrapped in our ApiResponse format, return as is
        if (data && typeof data === 'object' && 'success' in data && 'message' in data) {
          return data;
        }

        // Otherwise, wrap the response
        const statusCode = response.statusCode;
        const path = request.url;
        
        // Determine appropriate message based on HTTP method and status
        let message = 'Operation successful';
        if (request.method === 'POST' && statusCode === 201) {
          message = 'Resource created successfully';
        } else if (request.method === 'PUT' || request.method === 'PATCH') {
          message = 'Resource updated successfully';
        } else if (request.method === 'DELETE') {
          message = 'Resource deleted successfully';
        } else if (request.method === 'GET') {
          message = 'Data retrieved successfully';
        }

        return ResponseUtil.success(data, message, statusCode, path);
      }),
    );
  }
} 