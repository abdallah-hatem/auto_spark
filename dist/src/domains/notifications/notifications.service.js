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
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const firebase_service_1 = require("./services/firebase.service");
const send_notification_dto_1 = require("./dto/send-notification.dto");
const user_repository_1 = require("../users/repositories/user.repository");
const logger_service_1 = require("../../common/services/logger.service");
let NotificationsService = class NotificationsService {
    firebaseService;
    userRepository;
    logger;
    constructor(firebaseService, userRepository, logger) {
        this.firebaseService = firebaseService;
        this.userRepository = userRepository;
        this.logger = logger;
    }
    async sendToUser(sendNotificationDto) {
        const { userId, title, body, type, data, imageUrl } = sendNotificationDto;
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (!user.deviceToken) {
            throw new common_1.BadRequestException('User does not have a device token registered');
        }
        const result = await this.firebaseService.sendNotification({
            token: user.deviceToken,
            notification: {
                title,
                body,
                imageUrl,
            },
            data: {
                type: type || send_notification_dto_1.NotificationType.GENERAL,
                userId,
                ...data,
            },
        });
        this.logger.logSuccess(`Notification sent to user ${userId}: ${title}`);
        return result;
    }
    async sendToMultipleUsers(sendBulkNotificationDto) {
        const { userIds, title, body, type, data, imageUrl } = sendBulkNotificationDto;
        const users = await Promise.all(userIds.map(id => this.userRepository.findById(id)));
        const validUsers = users.filter(user => user && user.deviceToken);
        const deviceTokens = validUsers.map(user => user.deviceToken);
        if (deviceTokens.length === 0) {
            throw new common_1.BadRequestException('No users with valid device tokens found');
        }
        const result = await this.firebaseService.sendBulkNotifications(deviceTokens, {
            title,
            body,
            imageUrl,
        }, {
            type: type || send_notification_dto_1.NotificationType.GENERAL,
            ...data,
        });
        this.logger.logSuccess(`Bulk notification sent: ${result.successCount}/${deviceTokens.length} successful`);
        return {
            totalRequested: userIds.length,
            totalSent: deviceTokens.length,
            successCount: result.successCount,
            failureCount: result.failureCount,
        };
    }
    async sendToUsersByRole(role, title, body, data) {
        const users = await this.userRepository.findAll();
        const roleUsers = users.filter(user => user.role === role && user.deviceToken);
        if (roleUsers.length === 0) {
            throw new common_1.BadRequestException(`No ${role} users with device tokens found`);
        }
        const userIds = roleUsers.map(user => user.id);
        return this.sendToMultipleUsers({
            userIds,
            title,
            body,
            data,
        });
    }
    async notifyBookingCreated(customerId, washerId, bookingId) {
        await Promise.all([
            this.sendToUser({
                userId: customerId,
                title: 'Booking Confirmed! 🎉',
                body: 'Your car wash booking has been created successfully.',
                type: send_notification_dto_1.NotificationType.BOOKING_CREATED,
                data: { bookingId, role: 'customer' },
            }).catch(error => this.logger.logBusinessError(`Failed to notify customer ${customerId}: ${error.message}`)),
            this.sendToUser({
                userId: washerId,
                title: 'New Booking Available! 🚗',
                body: 'You have a new car wash booking request.',
                type: send_notification_dto_1.NotificationType.BOOKING_CREATED,
                data: { bookingId, role: 'washer' },
            }).catch(error => this.logger.logBusinessError(`Failed to notify washer ${washerId}: ${error.message}`)),
        ]);
    }
    async notifyBookingAccepted(customerId, washerId, bookingId) {
        await this.sendToUser({
            userId: customerId,
            title: 'Booking Accepted! ✅',
            body: 'Your car wash booking has been accepted by a washer.',
            type: send_notification_dto_1.NotificationType.BOOKING_ACCEPTED,
            data: { bookingId, washerId },
        }).catch(error => this.logger.logBusinessError(`Failed to notify customer: ${error.message}`));
    }
    async notifyBookingCompleted(customerId, bookingId) {
        await this.sendToUser({
            userId: customerId,
            title: 'Service Completed! 🎊',
            body: 'Your car wash service has been completed. Please rate your experience!',
            type: send_notification_dto_1.NotificationType.BOOKING_COMPLETED,
            data: { bookingId },
        }).catch(error => this.logger.logBusinessError(`Failed to notify customer: ${error.message}`));
    }
    async notifyPaymentSuccess(userId, amount, bookingId) {
        await this.sendToUser({
            userId,
            title: 'Payment Successful! 💳',
            body: `Your payment of $${amount} has been processed successfully.`,
            type: send_notification_dto_1.NotificationType.PAYMENT_SUCCESS,
            data: { bookingId, amount: amount.toString() },
        }).catch(error => this.logger.logBusinessError(`Failed to notify payment success: ${error.message}`));
    }
    async updateDeviceToken(userId, deviceToken) {
        const isValid = await this.firebaseService.verifyToken(deviceToken);
        if (!isValid) {
            throw new common_1.BadRequestException('Invalid device token');
        }
        await this.userRepository.update(userId, { deviceToken });
        this.logger.logSuccess(`Device token updated for user ${userId}`);
    }
    async removeDeviceToken(userId) {
        await this.userRepository.update(userId, { deviceToken: null });
        this.logger.logSuccess(`Device token removed for user ${userId}`);
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService,
        user_repository_1.UserRepository,
        logger_service_1.LoggerService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map