import { ApiResponse, Meta } from '../interfaces/api-response.interface';
export declare class ResponseUtil {
    static success<T>(data: T, message?: string, statusCode?: number, path?: string, meta?: Meta): ApiResponse<T>;
    static error(message?: string, statusCode?: number, error?: string, path?: string): ApiResponse;
    static created<T>(data: T, message?: string, path?: string): ApiResponse<T>;
    static updated<T>(data: T, message?: string, path?: string): ApiResponse<T>;
    static deleted(message?: string, path?: string): ApiResponse;
    static notFound(message?: string, path?: string): ApiResponse;
    static badRequest(message?: string, error?: string, path?: string): ApiResponse;
    static unauthorized(message?: string, path?: string): ApiResponse;
    static forbidden(message?: string, path?: string): ApiResponse;
    static conflict(message?: string, error?: string, path?: string): ApiResponse;
}
