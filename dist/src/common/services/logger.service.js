"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerService = void 0;
const common_1 = require("@nestjs/common");
let LoggerService = class LoggerService {
    logger = new common_1.Logger('Application');
    logSuccess(message, context) {
        const formattedMessage = this.formatMessage('✅ SUCCESS', message, context);
        this.logger.log(formattedMessage);
    }
    logAuth(message, context) {
        const formattedMessage = this.formatMessage('🔐 AUTH', message, context);
        this.logger.log(formattedMessage);
    }
    logDatabase(message, context) {
        const formattedMessage = this.formatMessage('💾 DATABASE', message, context);
        this.logger.log(formattedMessage);
    }
    logApi(message, context) {
        const formattedMessage = this.formatMessage('🌐 API', message, context);
        this.logger.log(formattedMessage);
    }
    logValidation(message, context) {
        const formattedMessage = this.formatMessage('⚠️ VALIDATION', message, context);
        this.logger.warn(formattedMessage);
    }
    logBusinessError(message, context) {
        const formattedMessage = this.formatMessage('❌ BUSINESS_ERROR', message, context);
        this.logger.error(formattedMessage);
    }
    logSystemError(message, error, context) {
        const formattedMessage = this.formatMessage('🚨 SYSTEM_ERROR', message, context);
        this.logger.error(formattedMessage);
        if (error) {
            this.logger.error(`Stack trace: ${error.stack}`);
        }
    }
    logUserAction(action, userId, resource, metadata) {
        const context = {
            userId,
            action,
            resource,
            metadata
        };
        const message = `User performed action: ${action}${resource ? ` on ${resource}` : ''}`;
        const formattedMessage = this.formatMessage('👤 USER_ACTION', message, context);
        this.logger.log(formattedMessage);
    }
    formatMessage(type, message, context) {
        let formatted = `[${type}] ${message}`;
        if (context) {
            const contextParts = [];
            if (context.userId)
                contextParts.push(`userId=${context.userId}`);
            if (context.requestId)
                contextParts.push(`requestId=${context.requestId}`);
            if (context.action)
                contextParts.push(`action=${context.action}`);
            if (context.resource)
                contextParts.push(`resource=${context.resource}`);
            if (contextParts.length > 0) {
                formatted += ` | ${contextParts.join(', ')}`;
            }
            if (context.metadata && Object.keys(context.metadata).length > 0) {
                formatted += ` | metadata=${JSON.stringify(context.metadata)}`;
            }
        }
        return formatted;
    }
    debug(message, context) {
        if (process.env.NODE_ENV === 'development') {
            const formattedMessage = this.formatMessage('🐛 DEBUG', message, context);
            this.logger.debug(formattedMessage);
        }
    }
};
exports.LoggerService = LoggerService;
exports.LoggerService = LoggerService = __decorate([
    (0, common_1.Injectable)()
], LoggerService);
//# sourceMappingURL=logger.service.js.map