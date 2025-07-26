import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { LoggerService } from '../services/logger.service';
export declare class LoggingInterceptor implements NestInterceptor {
    private readonly loggerService;
    private readonly reflector;
    constructor(loggerService: LoggerService, reflector: Reflector);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
    private logByLevel;
}
