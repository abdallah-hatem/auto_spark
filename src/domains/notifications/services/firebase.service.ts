import { Injectable, OnModuleInit, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { FirebaseConfig, FCMMessage } from '../interfaces/firebase.interface';
import { LoggerService } from '@/common/services/logger.service';
import * as serviceAccount from '@/config/fcm.config.json';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseService.name);
  private app: admin.app.App;

  constructor(
    private readonly configService: ConfigService,
    private readonly loggerService: LoggerService,
  ) {}

  async onModuleInit() {
    await this.initializeFirebase();
  }

  private async initializeFirebase() {
    try {
      // Initialize Firebase Admin SDK using imported service account
      this.app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      });

      this.loggerService.logSuccess('Firebase Admin SDK initialized successfully');
      this.logger.log('🔥 Firebase FCM service is ready');
    } catch (error) {
      this.loggerService.logSystemError('Failed to initialize Firebase Admin SDK', error);
      throw error;
    }
  }

  async sendNotification(message: FCMMessage): Promise<string> {
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
    } catch (error) {
      this.loggerService.logSystemError('Failed to send notification', error);
      throw new BadRequestException(`Failed to send notification: ${error.message}`);
    }
  }

  async sendBulkNotifications(tokens: string[], notification: any, data?: any): Promise<admin.messaging.BatchResponse> {
    try {
      if (tokens.length === 0) {
        throw new BadRequestException('No device tokens provided');
      }

      const messages: admin.messaging.MulticastMessage = {
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

      this.loggerService.logSuccess(
        `Bulk notifications sent: ${response.successCount}/${tokens.length} successful`,
      );

      // Log failed tokens for debugging
      if (response.failureCount > 0) {
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            this.loggerService.logBusinessError(
              `Failed to send to token ${tokens[idx]}: ${resp.error?.message}`,
            );
          }
        });
      }

      return response;
    } catch (error) {
      this.loggerService.logSystemError('Failed to send bulk notifications', error);
      throw new BadRequestException(`Failed to send bulk notifications: ${error.message}`);
    }
  }

  async verifyToken(token: string): Promise<boolean> {
    try {
      // Try to send a test message to verify token validity
      await admin.messaging().send({
        token,
        data: { test: 'true' },
      }, true); // dry-run mode
      return true;
    } catch (error) {
      this.logger.warn(`Invalid FCM token: ${error.message}`);
      return false;
    }
  }
} 