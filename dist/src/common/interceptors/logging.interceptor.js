"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingInterceptor = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const rxjs_1 = require("rxjs");
const logger_service_1 = require("../services/logger.service");
const log_decorator_1 = require("../decorators/log.decorator");
let LoggingInterceptor = class LoggingInterceptor {
    loggerService;
    reflector;
    constructor(loggerService, reflector) {
        this.loggerService = loggerService;
        this.reflector = reflector;
    }
    intercept(context, next) {
        const logOptions = this.reflector.get(log_decorator_1.LOG_METADATA, context.getHandler());
        if (!logOptions || logOptions.skipLogging) {
            return next.handle();
        }
        const className = context.getClass().name;
        const methodName = context.getHandler().name;
        const action = logOptions.action || `${className}.${methodName}`;
        const level = logOptions.level || 'log';
        const args = context.getArgs();
        const request = context.switchToHttp().getRequest();
        const userId = request?.user?.id;
        const startTime = Date.now();
        let argContext = {};
        if (logOptions.extractContext?.fromArgs) {
            try {
                argContext = logOptions.extractContext.fromArgs(args) || {};
            }
            catch (error) {
            }
        }
        const entryMessage = logOptions.messages?.start || `Method started: ${action}`;
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
        return next.handle().pipe((0, rxjs_1.tap)((result) => {
            const duration = Date.now() - startTime;
            let resultContext = {};
            if (logOptions.extractContext?.fromResult) {
                try {
                    resultContext = logOptions.extractContext.fromResult(result) || {};
                }
                catch (error) {
                }
            }
            const successMessage = logOptions.messages?.success ||
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
        }), (0, rxjs_1.catchError)((error) => {
            const duration = Date.now() - startTime;
            let errorContext = {};
            if (logOptions.extractContext?.fromError) {
                try {
                    errorContext =
                        logOptions.extractContext.fromError(error, args) || {};
                }
                catch (extractError) {
                }
            }
            const errorMessage = logOptions.messages?.error ||
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
            return (0, rxjs_1.throwError)(() => error);
        }));
    }
    logByLevel(level, message, context) {
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
};
exports.LoggingInterceptor = LoggingInterceptor;
exports.LoggingInterceptor = LoggingInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logger_service_1.LoggerService,
        core_1.Reflector])
], LoggingInterceptor);
//# sourceMappingURL=logging.interceptor.js.map