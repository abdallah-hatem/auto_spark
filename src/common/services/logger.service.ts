import { Injectable, Logger, LogLevel } from '@nestjs/common';

export interface LogContext {
  userId?: string;
  requestId?: string;
  action?: string;
  resource?: string;
  metadata?: Record<string, any>;
}

@Injectable()
export class LoggerService {
  private readonly logger = new Logger('Application');

  /**
   * Log successful operations
   */
  logSuccess(message: string, context?: LogContext) {
    const formattedMessage = this.formatMessage('✅ SUCCESS', message, context);
    this.logger.log(formattedMessage);
  }

  /**
   * Log authentication events
   */
  logAuth(message: string, context?: LogContext) {
    const formattedMessage = this.formatMessage('🔐 AUTH', message, context);
    this.logger.log(formattedMessage);
  }

  /**
   * Log database operations
   */
  logDatabase(message: string, context?: LogContext) {
    const formattedMessage = this.formatMessage('💾 DATABASE', message, context);
    this.logger.log(formattedMessage);
  }

  /**
   * Log API calls and external services
   */
  logApi(message: string, context?: LogContext) {
    const formattedMessage = this.formatMessage('🌐 API', message, context);
    this.logger.log(formattedMessage);
  }

  /**
   * Log validation errors
   */
  logValidation(message: string, context?: LogContext) {
    const formattedMessage = this.formatMessage('⚠️ VALIDATION', message, context);
    this.logger.warn(formattedMessage);
  }

  /**
   * Log business logic errors
   */
  logBusinessError(message: string, context?: LogContext) {
    const formattedMessage = this.formatMessage('❌ BUSINESS_ERROR', message, context);
    this.logger.error(formattedMessage);
  }

  /**
   * Log system errors
   */
  logSystemError(message: string, error?: Error, context?: LogContext) {
    const formattedMessage = this.formatMessage('🚨 SYSTEM_ERROR', message, context);
    this.logger.error(formattedMessage);
    
    if (error) {
      this.logger.error(`Stack trace: ${error.stack}`);
    }
  }

  /**
   * Log user actions for audit trail
   */
  logUserAction(action: string, userId: string, resource?: string, metadata?: Record<string, any>) {
    const context: LogContext = {
      userId,
      action,
      resource,
      metadata
    };
    const message = `User performed action: ${action}${resource ? ` on ${resource}` : ''}`;
    const formattedMessage = this.formatMessage('👤 USER_ACTION', message, context);
    this.logger.log(formattedMessage);
  }

  /**
   * Format log messages with context
   */
  private formatMessage(type: string, message: string, context?: LogContext): string {
    let formatted = `[${type}] ${message}`;
    
    if (context) {
      const contextParts: string[] = [];
      
      if (context.userId) contextParts.push(`userId=${context.userId}`);
      if (context.requestId) contextParts.push(`requestId=${context.requestId}`);
      if (context.action) contextParts.push(`action=${context.action}`);
      if (context.resource) contextParts.push(`resource=${context.resource}`);
      
      if (contextParts.length > 0) {
        formatted += ` | ${contextParts.join(', ')}`;
      }
      
      if (context.metadata && Object.keys(context.metadata).length > 0) {
        formatted += ` | metadata=${JSON.stringify(context.metadata)}`;
      }
    }
    
    return formatted;
  }

  /**
   * Debug logging (only in development)
   */
  debug(message: string, context?: LogContext) {
    if (process.env.NODE_ENV === 'development') {
      const formattedMessage = this.formatMessage('🐛 DEBUG', message, context);
      this.logger.debug(formattedMessage);
    }
  }
} 