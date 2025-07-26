import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/database/database.service';
import { BaseRepository } from '@/common/repositories/base.repository';
import { ICouponRepository } from '../interfaces/coupons-repository.interface';
import { Coupon } from '../entities/coupon.entity';
import { CreateCouponDto } from '../dto/create-coupon.dto';
import { UpdateCouponDto } from '../dto/update-coupon.dto';

@Injectable()
export class CouponRepository
  extends BaseRepository<Coupon, CreateCouponDto, UpdateCouponDto>
  implements ICouponRepository
{
  constructor(databaseService: DatabaseService) {
    super(databaseService, 'coupon');
  }

  async findByCode(code: string): Promise<Coupon | null> {
    return this.model.findFirst({
      where: { code },
    });
  }

  async findActiveCoupons(): Promise<Coupon[]> {
    return this.model.findMany({
      where: {
        isActive: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
    });
  }

  async incrementUsage(id: string): Promise<Coupon> {
    return this.model.update({
      where: { id },
      data: {
        uses: {
          increment: 1,
        },
      },
    });
  }
}
