"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogExtractors = exports.LogError = exports.LogWarn = exports.LogDebug = exports.SkipLog = exports.Log = exports.LOG_METADATA = void 0;
const logger_service_1 = require("../services/logger.service");
exports.LOG_METADATA = 'log_metadata';
const Log = (options = {}) => {
    return function (target, propertyName, descriptor) {
        const method = descriptor.value;
        const className = target.constructor.name;
        const action = options.action || `${className}.${propertyName}`;
        const level = options.level || 'log';
        descriptor.value = async function (...args) {
            const loggerService = this.loggerService ||
                this.logger ||
                new logger_service_1.LoggerService();
            const startTime = Date.now();
            let argContext = {};
            if (options.extractContext?.fromArgs) {
                try {
                    argContext = options.extractContext.fromArgs(args) || {};
                }
                catch (error) {
                }
            }
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
                const result = await method.apply(this, args);
                const duration = Date.now() - startTime;
                let resultContext = {};
                if (options.extractContext?.fromResult) {
                    try {
                        resultContext = options.extractContext.fromResult(result) || {};
                    }
                    catch (error) {
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
            }
            catch (error) {
                const duration = Date.now() - startTime;
                let errorContext = {};
                if (options.extractContext?.fromError) {
                    try {
                        errorContext = options.extractContext.fromError(error, args) || {};
                    }
                    catch (extractError) {
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
exports.Log = Log;
function logByLevel(loggerService, level, message, context) {
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
const SkipLog = () => (0, exports.Log)({ skipLogging: true });
exports.SkipLog = SkipLog;
const LogDebug = (action) => (0, exports.Log)({ action, level: 'debug' });
exports.LogDebug = LogDebug;
const LogWarn = (action) => (0, exports.Log)({ action, level: 'warn' });
exports.LogWarn = LogWarn;
const LogError = (action) => (0, exports.Log)({ action, level: 'error' });
exports.LogError = LogError;
exports.LogExtractors = {
    userFromResult: (result) => ({
        userId: result?.id,
        email: result?.email,
        name: result?.name,
    }),
    emailFromDto: (args) => ({
        email: args[0]?.email,
        name: args[0]?.name,
    }),
    userIdFromArgs: (args) => ({
        userId: args[0],
    }),
    emailFromError: (error, args) => ({
        email: args[0]?.email,
        errorMessage: error.message,
    }),
};
//# sourceMappingURL=log.decorator.js.map