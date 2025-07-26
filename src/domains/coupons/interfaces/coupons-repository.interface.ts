import { IRepository } from '@/common/interfaces/repository.interface';
import { Coupon } from '../entities/coupon.entity';
import { CreateCouponDto } from '../dto/create-coupon.dto';
import { UpdateCouponDto } from '../dto/update-coupon.dto';

export interface ICouponRepository
  extends IRepository<Coupon, CreateCouponDto, UpdateCouponDto> {
  findByCode(code: string): Promise<Coupon | null>;
  findActiveCoupons(): Promise<Coupon[]>;
  incrementUsage(id: string): Promise<Coupon>;
} 