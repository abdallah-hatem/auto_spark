import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { FCMMessage } from '../interfaces/firebase.interface';
import { LoggerService } from '@/common/services/logger.service';
export declare class FirebaseService implements OnModuleInit {
    private readonly configService;
    private readonly loggerService;
    private readonly logger;
    private app;
    constructor(configService: ConfigService, loggerService: LoggerService);
    onModuleInit(): Promise<void>;
    private initializeFirebase;
    sendNotification(message: FCMMessage): Promise<string>;
    sendBulkNotifications(tokens: string[], notification: any, data?: any): Promise<admin.messaging.BatchResponse>;
    verifyToken(token: string): Promise<boolean>;
}
