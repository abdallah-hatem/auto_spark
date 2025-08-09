import { Module, forwardRef } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { BookingRepository } from './repositories/booking.repository';
import { DatabaseModule } from '@/database/database.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { UsersModule } from '../users/users.module';
import { PaymentModule } from '../payment/payment.module';

@Module({
  controllers: [BookingController],
  providers: [BookingService, BookingRepository],
  exports: [BookingService],
  imports: [DatabaseModule, NotificationsModule, UsersModule, forwardRef(() => PaymentModule)],
})
export class BookingModule {}
