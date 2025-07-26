"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const response_util_1 = require("../utils/response.util");
let ResponseInterceptor = class ResponseInterceptor {
    intercept(context, next) {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        return next.handle().pipe((0, operators_1.map)((data) => {
            if (data && typeof data === 'object' && 'success' in data && 'message' in data) {
                return data;
            }
            const statusCode = response.statusCode;
            const path = request.url;
            let message = 'Operation successful';
            if (request.method === 'POST' && statusCode === 201) {
                message = 'Resource created successfully';
            }
            else if (request.method === 'PUT' || request.method === 'PATCH') {
                message = 'Resource updated successfully';
            }
            else if (request.method === 'DELETE') {
                message = 'Resource deleted successfully';
            }
            else if (request.method === 'GET') {
                message = 'Data retrieved successfully';
            }
            return response_util_1.ResponseUtil.success(data, message, statusCode, path);
        }));
    }
};
exports.ResponseInterceptor = ResponseInterceptor;
exports.ResponseInterceptor = ResponseInterceptor = __decorate([
    (0, common_1.Injectable)()
], ResponseInterceptor);
//# sourceMappingURL=response.interceptor.js.map