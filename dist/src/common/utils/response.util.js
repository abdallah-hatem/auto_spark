"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseUtil = void 0;
const common_1 = require("@nestjs/common");
class ResponseUtil {
    static success(data, message = 'Operation successful', statusCode = common_1.HttpStatus.OK, path, meta) {
        return {
            success: true,
            message,
            statusCode,
            data,
            timestamp: new Date().toISOString(),
            path,
            meta,
        };
    }
    static error(message = 'Operation failed', statusCode = common_1.HttpStatus.INTERNAL_SERVER_ERROR, error, path) {
        return {
            success: false,
            message,
            statusCode,
            error,
            timestamp: new Date().toISOString(),
            path,
        };
    }
    static created(data, message = 'Resource created successfully', path) {
        return this.success(data, message, common_1.HttpStatus.CREATED, path);
    }
    static updated(data, message = 'Resource updated successfully', path) {
        return this.success(data, message, common_1.HttpStatus.OK, path);
    }
    static deleted(message = 'Resource deleted successfully', path) {
        return this.success(null, message, common_1.HttpStatus.OK, path);
    }
    static notFound(message = 'Resource not found', path) {
        return this.error(message, common_1.HttpStatus.NOT_FOUND, 'NOT_FOUND', path);
    }
    static badRequest(message = 'Bad request', error, path) {
        return this.error(message, common_1.HttpStatus.BAD_REQUEST, error, path);
    }
    static unauthorized(message = 'Unauthorized access', path) {
        return this.error(message, common_1.HttpStatus.UNAUTHORIZED, 'UNAUTHORIZED', path);
    }
    static forbidden(message = 'Forbidden access', path) {
        return this.error(message, common_1.HttpStatus.FORBIDDEN, 'FORBIDDEN', path);
    }
    static conflict(message = 'Resource conflict', error, path) {
        return this.error(message, common_1.HttpStatus.CONFLICT, error, path);
    }
}
exports.ResponseUtil = ResponseUtil;
//# sourceMappingURL=response.util.js.map