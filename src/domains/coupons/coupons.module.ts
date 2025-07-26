import { Module } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CouponsController } from './coupons.controller';
import { DatabaseModule } from '@/database/database.module';
import { CouponRepository } from './repositories/coupons.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [CouponsController],
  providers: [CouponsService, CouponRepository],
  exports: [CouponsService],
})
export class CouponsModule {}
