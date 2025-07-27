"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("./database/database.service");
const users_module_1 = require("./domains/users/users.module");
const auth_module_1 = require("./domains/auth/auth.module");
const database_module_1 = require("./database/database.module");
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const database_config_1 = require("./config/database.config");
const response_interceptor_1 = require("./common/interceptors/response.interceptor");
const logger_middleware_1 = require("./common/middleware/logger.middleware");
const logger_service_1 = require("./common/services/logger.service");
const services_module_1 = require("./domains/services/services.module");
const coupons_module_1 = require("./domains/coupons/coupons.module");
const notifications_module_1 = require("./domains/notifications/notifications.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(logger_middleware_1.LoggerMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [database_config_1.default],
            }),
            database_module_1.DatabaseModule,
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            services_module_1.ServicesModule,
            coupons_module_1.CouponsModule,
            notifications_module_1.NotificationsModule,
        ],
        controllers: [],
        providers: [
            database_service_1.DatabaseService,
            logger_service_1.LoggerService,
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: response_interceptor_1.ResponseInterceptor,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map