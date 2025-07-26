export interface LogContext {
    userId?: string;
    requestId?: string;
    action?: string;
    resource?: string;
    metadata?: Record<string, any>;
}
export declare class LoggerService {
    private readonly logger;
    logSuccess(message: string, context?: LogContext): void;
    logAuth(message: string, context?: LogContext): void;
    logDatabase(message: string, context?: LogContext): void;
    logApi(message: string, context?: LogContext): void;
    logValidation(message: string, context?: LogContext): void;
    logBusinessError(message: string, context?: LogContext): void;
    logSystemError(message: string, error?: Error, context?: LogContext): void;
    logUserAction(action: string, userId: string, resource?: string, metadata?: Record<string, any>): void;
    private formatMessage;
    debug(message: string, context?: LogContext): void;
}
