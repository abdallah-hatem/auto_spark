import { FirebaseService } from './services/firebase.service';
import { SendNotificationDto, SendBulkNotificationDto } from './dto/send-notification.dto';
import { UserRepository } from '@/domains/users/repositories/user.repository';
import { LoggerService } from '@/common/services/logger.service';
export declare class NotificationsService {
    private readonly firebaseService;
    private readonly userRepository;
    private readonly logger;
    constructor(firebaseService: FirebaseService, userRepository: UserRepository, logger: LoggerService);
    sendToUser(sendNotificationDto: SendNotificationDto): Promise<string>;
    sendToMultipleUsers(sendBulkNotificationDto: SendBulkNotificationDto): Promise<any>;
    sendToUsersByRole(role: string, title: string, body: string, data?: Record<string, string>): Promise<any>;
    notifyBookingCreated(customerId: string, washerId: string, bookingId: string): Promise<void>;
    notifyBookingAccepted(customerId: string, washerId: string, bookingId: string): Promise<void>;
    notifyBookingCompleted(customerId: string, bookingId: string): Promise<void>;
    notifyPaymentSuccess(userId: string, amount: number, bookingId: string): Promise<void>;
    updateDeviceToken(userId: string, deviceToken: string): Promise<void>;
    removeDeviceToken(userId: string): Promise<void>;
}
