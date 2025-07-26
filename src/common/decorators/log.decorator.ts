import { SetMetadata } from '@nestjs/common';
import { LoggerService } from '../services/logger.service';

export const LOG_METADATA = 'log_metadata';

export interface LogOptions {
  action?: string;
  level?: 'log' | 'debug' | 'warn' | 'error';
  includeArgs?: boolean;
  includeResult?: boolean;
  skipLogging?: boolean;
  // Context extractors for rich logging
  extractContext?: {
    fromArgs?: (args: any[]) => Record<string, any>;
    fromResult?: (result: any) => Record<string, any>;
    fromError?: (error: any, args: any[]) => Record<string, any>;
  };
  // Custom messages
  messages?: {
    start?: string;
    success?: string;
    error?: string;
  };
}

/**
 * Method decorator that automatically logs method calls with rich context
 * Works directly on service methods without needing interceptors
 * Usage: @Log({ action: 'create_user', extractContext: { fromResult: (user) => ({ userId: user.id, email: user.email }) } })
 */
export const Log = (options: LogOptions = {}) => {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;
    const className = target.constructor.name;
    const action = options.action || `${className}.${propertyName}`;
    const level = options.level || 'log';

    descriptor.value = async function (...args: any[]) {
      // Get logger service from the class instance (assuming it's injected)
      const loggerService: LoggerService = (this as any).loggerService || 
                                          (this as any).logger ||
                                          new LoggerService();

      const startTime = Date.now();

      // Extract context from arguments
      let argContext = {};
      if (options.extractContext?.fromArgs) {
        try {
          argContext = options.extractContext.fromArgs(args) || {};
        } catch (error) {
          // Ignore context extraction errors
        }
      }

      // Log method entry
      const entryMessage = options.messages?.start || `Method started: ${action}`;
      logByLevel(loggerService, level, entryMessage, {
        action,
        metadata: { 
          class: className, 
          method: propertyName,
          ...argContext,
          ...(options.includeArgs && { args })
        }
      });

      try {
        // Call the original method
        const result = await method.apply(this, args);
        
        // Log successful completion
        const duration = Date.now() - startTime;
        
        // Extract context from result
        let resultContext: any = {};
        if (options.extractContext?.fromResult) {
          try {
            resultContext = options.extractContext.fromResult(result) || {};
          } catch (error) {
            // Ignore context extraction errors
          }
        }

        const successMessage = options.messages?.success || `Method completed: ${action} (${duration}ms)`;
        
        logByLevel(loggerService, level, successMessage, {
          userId: resultContext.userId,
          action,
          metadata: { 
            class: className, 
            method: propertyName,
            duration,
            ...argContext,
            ...resultContext,
            ...(options.includeResult && { result })
          }
        });

        return result;
      } catch (error) {
        // Log error
        const duration = Date.now() - startTime;
        
        // Extract context from error
        let errorContext = {};
        if (options.extractContext?.fromError) {
          try {
            errorContext = options.extractContext.fromError(error, args) || {};
          } catch (extractError) {
            // Ignore context extraction errors
          }
        }

        const errorMessage = options.messages?.error || `Method failed: ${action} (${duration}ms)`;
        
        loggerService.logSystemError(errorMessage, error, {
          action,
          metadata: { 
            class: className, 
            method: propertyName,
            duration,
            ...argContext,
            ...errorContext,
            error: error.message
          }
        });

        throw error;
      }
    };

    return descriptor;
  };
};

function logByLevel(loggerService: LoggerService, level: string, message: string, context: any) {
  switch (level) {
    case 'debug':
      loggerService.debug(message, context);
      break;
    case 'warn':
      loggerService.logValidation(message, context);
      break;
    case 'error':
      loggerService.logSystemError(message, undefined, context);
      break;
    default:
      loggerService.logSuccess(message, context);
  }
}

/**
 * Skip logging for this method
 */
export const SkipLog = () => Log({ skipLogging: true });

/**
 * Log with different levels
 */
export const LogDebug = (action?: string) => Log({ action, level: 'debug' });
export const LogWarn = (action?: string) => Log({ action, level: 'warn' });
export const LogError = (action?: string) => Log({ action, level: 'error' });

/**
 * Predefined extractors for common patterns
 */
export const LogExtractors = {
  // Extract user data from result
  userFromResult: (result: any) => ({
    userId: result?.id,
    email: result?.email,
    name: result?.name,
  }),
  
  // Extract email from DTO in first argument
  emailFromDto: (args: any[]) => ({
    email: args[0]?.email,
    name: args[0]?.name,
  }),
  
  // Extract user ID from first argument
  userIdFromArgs: (args: any[]) => ({
    userId: args[0],
  }),
  
  // Extract email from error context
  emailFromError: (error: any, args: any[]) => ({
    email: args[0]?.email,
    errorMessage: error.message,
  }),
}; 