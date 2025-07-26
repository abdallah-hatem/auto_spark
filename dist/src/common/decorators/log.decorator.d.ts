export declare const LOG_METADATA = "log_metadata";
export interface LogOptions {
    action?: string;
    level?: 'log' | 'debug' | 'warn' | 'error';
    includeArgs?: boolean;
    includeResult?: boolean;
    skipLogging?: boolean;
    extractContext?: {
        fromArgs?: (args: any[]) => Record<string, any>;
        fromResult?: (result: any) => Record<string, any>;
        fromError?: (error: any, args: any[]) => Record<string, any>;
    };
    messages?: {
        start?: string;
        success?: string;
        error?: string;
    };
}
export declare const Log: (options?: LogOptions) => (target: any, propertyName: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export declare const SkipLog: () => (target: any, propertyName: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export declare const LogDebug: (action?: string) => (target: any, propertyName: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export declare const LogWarn: (action?: string) => (target: any, propertyName: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export declare const LogError: (action?: string) => (target: any, propertyName: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
export declare const LogExtractors: {
    userFromResult: (result: any) => {
        userId: any;
        email: any;
        name: any;
    };
    emailFromDto: (args: any[]) => {
        email: any;
        name: any;
    };
    userIdFromArgs: (args: any[]) => {
        userId: any;
    };
    emailFromError: (error: any, args: any[]) => {
        email: any;
        errorMessage: any;
    };
};
