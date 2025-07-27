import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { FirebaseService } from './services/firebase.service';
import { LoggerService } from '@/common/services/logger.service';
import { UserRepository } from '@/domains/users/repositories/user.repository';
import { DatabaseModule } from '@/database/database.module';
import firebaseConfig from '@/config/firebase.config';

@Module({
  imports: [
    ConfigModule.forFeature(firebaseConfig),
    DatabaseModule,
  ],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    FirebaseService,
    LoggerService,
    UserRepository,
  ],
  exports: [NotificationsService], // Export so other modules can use it
})
export class NotificationsModule {} 