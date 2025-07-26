import { HttpStatus } from '@nestjs/common';
import { ApiResponse, Meta } from '../interfaces/api-response.interface';

export class ResponseUtil {
  static success<T>(
    data: T,
    message: string = 'Operation successful',
    statusCode: number = HttpStatus.OK,
    path?: string,
    meta?: Meta,
  ): ApiResponse<T> {
    return {
      success: true,
      message,
      statusCode,
      data,
      timestamp: new Date().toISOString(),
      path,
      meta,
    };
  }

  static error(
    message: string = 'Operation failed',
    statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
    error?: string,
    path?: string,
  ): ApiResponse {
    return {
      success: false,
      message,
      statusCode,
      error,
      timestamp: new Date().toISOString(),
      path,
    };
  }

  static created<T>(
    data: T,
    message: string = 'Resource created successfully',
    path?: string,
  ): ApiResponse<T> {
    return this.success(data, message, HttpStatus.CREATED, path);
  }

  static updated<T>(
    data: T,
    message: string = 'Resource updated successfully',
    path?: string,
  ): ApiResponse<T> {
    return this.success(data, message, HttpStatus.OK, path);
  }

  static deleted(
    message: string = 'Resource deleted successfully',
    path?: string,
  ): ApiResponse {
    return this.success(null, message, HttpStatus.OK, path);
  }

  static notFound(
    message: string = 'Resource not found',
    path?: string,
  ): ApiResponse {
    return this.error(message, HttpStatus.NOT_FOUND, 'NOT_FOUND', path);
  }

  static badRequest(
    message: string = 'Bad request',
    error?: string,
    path?: string,
  ): ApiResponse {
    return this.error(message, HttpStatus.BAD_REQUEST, error, path);
  }

  static unauthorized(
    message: string = 'Unauthorized access',
    path?: string,
  ): ApiResponse {
    return this.error(message, HttpStatus.UNAUTHORIZED, 'UNAUTHORIZED', path);
  }

  static forbidden(
    message: string = 'Forbidden access',
    path?: string,
  ): ApiResponse {
    return this.error(message, HttpStatus.FORBIDDEN, 'FORBIDDEN', path);
  }

  static conflict(
    message: string = 'Resource conflict',
    error?: string,
    path?: string,
  ): ApiResponse {
    return this.error(message, HttpStatus.CONFLICT, error, path);
  }
}
