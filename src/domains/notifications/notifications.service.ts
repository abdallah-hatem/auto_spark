import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { FirebaseService } from './services/firebase.service';
import { SendNotificationDto, SendBulkNotificationDto, NotificationType } from './dto/send-notification.dto';
import { UserRepository } from '@/domains/users/repositories/user.repository';
import { LoggerService } from '@/common/services/logger.service';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly userRepository: UserRepository,
    private readonly logger: LoggerService,
  ) {}

  /**
   * Send notification to a single user
   */
  async sendToUser(sendNotificationDto: SendNotificationDto): Promise<string> {
    const { userId, title, body, type, data, imageUrl } = sendNotificationDto;

    // Get user and their device token
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.deviceToken) {
      throw new BadRequestException('User does not have a device token registered');
    }

    // Send notification via Firebase
    const result = await this.firebaseService.sendNotification({
      token: user.deviceToken,
      notification: {
        title,
        body,
        imageUrl,
      },
      data: {
        type: type || NotificationType.GENERAL,
        userId,
        ...data,
      },
    });

    this.logger.logSuccess(`Notification sent to user ${userId}: ${title}`);
    return result;
  }

  /**
   * Send bulk notifications to multiple users
   */
  async sendToMultipleUsers(sendBulkNotificationDto: SendBulkNotificationDto): Promise<any> {
    const { userIds, title, body, type, data, imageUrl } = sendBulkNotificationDto;

    // Get all users and their device tokens
    const users = await Promise.all(
      userIds.map(id => this.userRepository.findById(id))
    );

    // Filter out users without device tokens
    const validUsers = users.filter(user => user && user.deviceToken);
    const deviceTokens = validUsers.map(user => user!.deviceToken!);

    if (deviceTokens.length === 0) {
      throw new BadRequestException('No users with valid device tokens found');
    }

    // Send bulk notifications
    const result = await this.firebaseService.sendBulkNotifications(
      deviceTokens,
      {
        title,
        body,
        imageUrl,
      },
      {
        type: type || NotificationType.GENERAL,
        ...data,
      }
    );

    this.logger.logSuccess(
      `Bulk notification sent: ${result.successCount}/${deviceTokens.length} successful`
    );

    return {
      totalRequested: userIds.length,
      totalSent: deviceTokens.length,
      successCount: result.successCount,
      failureCount: result.failureCount,
    };
  }

  /**
   * Send notification to all users with a specific role
   */
  async sendToUsersByRole(role: string, title: string, body: string, data?: Record<string, string>): Promise<any> {
    // Get all users with the specified role
    const users = await this.userRepository.findAll(); // You might want to add a findByRole method
    const roleUsers = users.filter(user => user.role === role && user.deviceToken);

    if (roleUsers.length === 0) {
      throw new BadRequestException(`No ${role} users with device tokens found`);
    }

    const userIds = roleUsers.map(user => user.id);

    return this.sendToMultipleUsers({
      userIds,
      title,
      body,
      data,
    });
  }

  /**
   * Booking-specific notification methods
   */
  async notifyBookingCreated(customerId: string, washerId: string, bookingId: string): Promise<void> {
    await Promise.all([
      // Notify customer
      this.sendToUser({
        userId: customerId,
        title: 'Booking Confirmed! 🎉',
        body: 'Your car wash booking has been created successfully.',
        type: NotificationType.BOOKING_CREATED,
        data: { bookingId, role: 'customer' },
      }).catch(error => this.logger.logBusinessError(`Failed to notify customer ${customerId}: ${error.message}`)),

      // Notify washer
      this.sendToUser({
        userId: washerId,
        title: 'New Booking Available! 🚗',
        body: 'You have a new car wash booking request.',
        type: NotificationType.BOOKING_CREATED,
        data: { bookingId, role: 'washer' },
      }).catch(error => this.logger.logBusinessError(`Failed to notify washer ${washerId}: ${error.message}`)),
    ]);
  }

  async notifyBookingAccepted(customerId: string, washerId: string, bookingId: string): Promise<void> {
    await this.sendToUser({
      userId: customerId,
      title: 'Booking Accepted! ✅',
      body: 'Your car wash booking has been accepted by a washer.',
      type: NotificationType.BOOKING_ACCEPTED,
      data: { bookingId, washerId },
    }).catch(error => this.logger.logBusinessError(`Failed to notify customer: ${error.message}`));
  }

  async notifyBookingCompleted(customerId: string, bookingId: string): Promise<void> {
    await this.sendToUser({
      userId: customerId,
      title: 'Service Completed! 🎊',
      body: 'Your car wash service has been completed. Please rate your experience!',
      type: NotificationType.BOOKING_COMPLETED,
      data: { bookingId },
    }).catch(error => this.logger.logBusinessError(`Failed to notify customer: ${error.message}`));
  }

  async notifyPaymentSuccess(userId: string, amount: number, bookingId: string): Promise<void> {
    await this.sendToUser({
      userId,
      title: 'Payment Successful! 💳',
      body: `Your payment of $${amount} has been processed successfully.`,
      type: NotificationType.PAYMENT_SUCCESS,
      data: { bookingId, amount: amount.toString() },
    }).catch(error => this.logger.logBusinessError(`Failed to notify payment success: ${error.message}`));
  }

  /**
   * Update user's device token
   */
  async updateDeviceToken(userId: string, deviceToken: string): Promise<void> {
    // Verify the token is valid
    const isValid = await this.firebaseService.verifyToken(deviceToken);
    if (!isValid) {
      throw new BadRequestException('Invalid device token');
    }

    // Update user's device token
    await this.userRepository.update(userId, { deviceToken });
    this.logger.logSuccess(`Device token updated for user ${userId}`);
  }

  /**
   * Remove user's device token (e.g., on logout)
   */
  async removeDeviceToken(userId: string): Promise<void> {
    await this.userRepository.update(userId, { deviceToken: null });
    this.logger.logSuccess(`Device token removed for user ${userId}`);
  }
} 