import { Module, forwardRef } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { DatabaseModule } from '@/database/database.module';
import { PaymentRepository } from './repositories/payment.repository';
import { PaymentController } from './payment.controller';
import { BookingModule } from '../booking/booking.module';

@Module({
  imports: [DatabaseModule, forwardRef(() => BookingModule)],
  controllers: [PaymentController],
  providers: [PaymentService, PaymentRepository],
  exports: [PaymentService],
})
export class PaymentModule {}
