import { NotificationsService } from './notifications.service';
import { SendNotificationDto, SendBulkNotificationDto } from './dto/send-notification.dto';
import { User } from '@/domains/users/entities/user.entity';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    sendNotification(sendNotificationDto: SendNotificationDto): Promise<{
        messageId: string;
    }>;
    sendBulkNotification(sendBulkNotificationDto: SendBulkNotificationDto): Promise<any>;
    sendToRole(role: string, body: {
        title: string;
        body: string;
        data?: Record<string, string>;
    }): Promise<any>;
    updateDeviceToken(user: User, body: {
        deviceToken: string;
    }): Promise<{
        message: string;
    }>;
    removeDeviceToken(user: User): Promise<{
        message: string;
    }>;
    sendTestNotification(user: User): Promise<{
        message: string;
    }>;
}
