import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { BookingRepository } from './repositories/booking.repository';
import { DatabaseModule } from '@/database/database.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [BookingController],
  providers: [BookingService, BookingRepository],
  exports: [BookingService],
  imports: [DatabaseModule, NotificationsModule, UsersModule],
})
export class BookingModule {}
