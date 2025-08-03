import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { DatabaseModule } from '@/database/database.module';
import { PaymentRepository } from './repositories/payment.repository';
import { PaymentController } from './payment.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [PaymentController],
  providers: [PaymentService, PaymentRepository],
  exports: [PaymentService],
})
export class PaymentModule {}
