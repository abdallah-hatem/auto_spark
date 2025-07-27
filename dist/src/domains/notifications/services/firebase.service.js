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
var FirebaseService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const admin = require("firebase-admin");
const logger_service_1 = require("../../../common/services/logger.service");
const serviceAccount = require("../../../config/fcm.config.json");
let FirebaseService = FirebaseService_1 = class FirebaseService {
    configService;
    loggerService;
    logger = new common_1.Logger(FirebaseService_1.name);
    app;
    constructor(configService, loggerService) {
        this.configService = configService;
        this.loggerService = loggerService;
    }
    async onModuleInit() {
        await this.initializeFirebase();
    }
    async initializeFirebase() {
        try {
            this.app = admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
            this.loggerService.logSuccess('Firebase Admin SDK initialized successfully');
            this.logger.log('🔥 Firebase FCM service is ready');
        }
        catch (error) {
            this.loggerService.logSystemError('Failed to initialize Firebase Admin SDK', error);
            throw error;
        }
    }
    async sendNotification(message) {
        try {
            const response = await admin.messaging().send({
                token: message.token,
                notification: message.notification,
                data: message.data,
                android: message.android || {
                    priority: 'high',
                    notification: {
                        sound: 'default',
                        clickAction: 'FLUTTER_NOTIFICATION_CLICK',
                    },
                },
                apns: message.apns || {
                    payload: {
                        aps: {
                            sound: 'default',
                            'content-available': 1,
                        },
                    },
                },
            });
            this.loggerService.logSuccess(`Notification sent successfully: ${response}`);
            return response;
        }
        catch (error) {
            this.loggerService.logSystemError('Failed to send notification', error);
            throw new common_1.BadRequestException(`Failed to send notification: ${error.message}`);
        }
    }
    async sendBulkNotifications(tokens, notification, data) {
        try {
            if (tokens.length === 0) {
                throw new common_1.BadRequestException('No device tokens provided');
            }
            const messages = {
                tokens,
                notification,
                data,
                android: {
                    priority: 'high',
                    notification: {
                        sound: 'default',
                        clickAction: 'FLUTTER_NOTIFICATION_CLICK',
                    },
                },
                apns: {
                    payload: {
                        aps: {
                            sound: 'default',
                            'content-available': 1,
                        },
                    },
                },
            };
            const response = await admin.messaging().sendEachForMulticast(messages);
            this.loggerService.logSuccess(`Bulk notifications sent: ${response.successCount}/${tokens.length} successful`);
            if (response.failureCount > 0) {
                response.responses.forEach((resp, idx) => {
                    if (!resp.success) {
                        this.loggerService.logBusinessError(`Failed to send to token ${tokens[idx]}: ${resp.error?.message}`);
                    }
                });
            }
            return response;
        }
        catch (error) {
            this.loggerService.logSystemError('Failed to send bulk notifications', error);
            throw new common_1.BadRequestException(`Failed to send bulk notifications: ${error.message}`);
        }
    }
    async verifyToken(token) {
        try {
            await admin.messaging().send({
                token,
                data: { test: 'true' },
            }, true);
            return true;
        }
        catch (error) {
            this.logger.warn(`Invalid FCM token: ${error.message}`);
            return false;
        }
    }
};
exports.FirebaseService = FirebaseService;
exports.FirebaseService = FirebaseService = FirebaseService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        logger_service_1.LoggerService])
], FirebaseService);
//# sourceMappingURL=firebase.service.js.map