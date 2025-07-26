import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { LoggerService } from '../services/logger.service';
import { LOG_METADATA, LogOptions } from '../decorators/log.decorator';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const logOptions = this.reflector.get<LogOptions>(
      LOG_METADATA,
      context.getHandler(),
    );

    // Skip if no log metadata or skipLogging is true
    if (!logOptions || logOptions.skipLogging) {
      return next.handle();
    }

    const className = context.getClass().name;
    const methodName = context.getHandler().name;
    const action = logOptions.action || `${className}.${methodName}`;
    const level = logOptions.level || 'log';
    const args = context.getArgs();

    // Get request context if available
    const request = context.switchToHttp().getRequest();
    const userId = request?.user?.id;

    const startTime = Date.now();

    // Extract context from arguments
    let argContext = {};
    if (logOptions.extractContext?.fromArgs) {
      try {
        argContext = logOptions.extractContext.fromArgs(args) || {};
      } catch (error) {
        // Ignore context extraction errors
      }
    }

    // Log method entry
    const entryMessage =
      logOptions.messages?.start || `Method started: ${action}`;
    this.logByLevel(level, entryMessage, {
      userId,
      action,
      metadata: {
        class: className,
        method: methodName,
        ...argContext,
        ...(logOptions.includeArgs && { args }),
      },
    });

    return next.handle().pipe(
      tap((result) => {
        // Log successful completion
        const duration = Date.now() - startTime;

        // Extract context from result
        let resultContext: any = {};
        if (logOptions.extractContext?.fromResult) {
          try {
            resultContext = logOptions.extractContext.fromResult(result) || {};
          } catch (error) {
            // Ignore context extraction errors
          }
        }

        const successMessage =
          logOptions.messages?.success ||
          `Method completed: ${action} (${duration}ms)`;

        this.logByLevel(level, successMessage, {
          userId: userId || resultContext.userId,
          action,
          metadata: {
            class: className,
            method: methodName,
            duration,
            ...argContext,
            ...resultContext,
            ...(logOptions.includeResult && { result }),
          },
        });
      }),
      catchError((error) => {
        // Log error
        const duration = Date.now() - startTime;

        // Extract context from error
        let errorContext = {};
        if (logOptions.extractContext?.fromError) {
          try {
            errorContext =
              logOptions.extractContext.fromError(error, args) || {};
          } catch (extractError) {
            // Ignore context extraction errors
          }
        }

        const errorMessage =
          logOptions.messages?.error ||
          `Method failed: ${action} (${duration}ms)`;

        this.loggerService.logSystemError(errorMessage, error, {
          userId,
          action,
          metadata: {
            class: className,
            method: methodName,
            duration,
            ...argContext,
            ...errorContext,
            error: error.message,
          },
        });

        return throwError(() => error);
      }),
    );
  }

  private logByLevel(level: string, message: string, context: any) {
    switch (level) {
      case 'debug':
        this.loggerService.debug(message, context);
        break;
      case 'warn':
        this.loggerService.logValidation(message, context);
        break;
      case 'error':
        this.loggerService.logSystemError(message, undefined, context);
        break;
      default:
        this.loggerService.logSuccess(message, context);
    }
  }
}
