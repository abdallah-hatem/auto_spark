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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsController = void 0;
const common_1 = require("@nestjs/common");
const notifications_service_1 = require("./notifications.service");
const send_notification_dto_1 = require("./dto/send-notification.dto");
const auth_decorator_1 = require("../auth/decorators/auth.decorator");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const get_user_decorator_1 = require("../auth/decorators/get-user.decorator");
let NotificationsController = class NotificationsController {
    notificationsService;
    constructor(notificationsService) {
        this.notificationsService = notificationsService;
    }
    async sendNotification(sendNotificationDto) {
        const messageId = await this.notificationsService.sendToUser(sendNotificationDto);
        return { messageId };
    }
    async sendBulkNotification(sendBulkNotificationDto) {
        return this.notificationsService.sendToMultipleUsers(sendBulkNotificationDto);
    }
    async sendToRole(role, body) {
        return this.notificationsService.sendToUsersByRole(role, body.title, body.body, body.data);
    }
    async updateDeviceToken(user, body) {
        await this.notificationsService.updateDeviceToken(user.id, body.deviceToken);
        return { message: 'Device token updated successfully' };
    }
    async removeDeviceToken(user) {
        await this.notificationsService.removeDeviceToken(user.id);
        return { message: 'Device token removed successfully' };
    }
    async sendTestNotification(user) {
        await this.notificationsService.sendToUser({
            userId: user.id,
            title: 'Test Notification 🧪',
            body: 'This is a test notification from AutoSpark!',
            data: { test: 'true' },
        });
        return { message: 'Test notification sent successfully' };
    }
};
exports.NotificationsController = NotificationsController;
__decorate([
    (0, common_1.Post)('send'),
    (0, auth_decorator_1.Auth)(),
    (0, roles_decorator_1.IsAdmin)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_notification_dto_1.SendNotificationDto]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "sendNotification", null);
__decorate([
    (0, common_1.Post)('send-bulk'),
    (0, auth_decorator_1.Auth)(),
    (0, roles_decorator_1.IsAdmin)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_notification_dto_1.SendBulkNotificationDto]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "sendBulkNotification", null);
__decorate([
    (0, common_1.Post)('send-to-role/:role'),
    (0, auth_decorator_1.Auth)(),
    (0, roles_decorator_1.IsAdmin)(),
    __param(0, (0, common_1.Param)('role')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "sendToRole", null);
__decorate([
    (0, common_1.Put)('device-token'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "updateDeviceToken", null);
__decorate([
    (0, common_1.Delete)('device-token'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "removeDeviceToken", null);
__decorate([
    (0, common_1.Post)('test'),
    (0, auth_decorator_1.Auth)(),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "sendTestNotification", null);
exports.NotificationsController = NotificationsController = __decorate([
    (0, common_1.Controller)('notifications'),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService])
], NotificationsController);
//# sourceMappingURL=notifications.controller.js.map