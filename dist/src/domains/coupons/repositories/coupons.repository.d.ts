import { DatabaseService } from '@/database/database.service';
import { BaseRepository } from '@/common/repositories/base.repository';
import { ICouponRepository } from '../interfaces/coupons-repository.interface';
import { Coupon } from '../entities/coupon.entity';
import { CreateCouponDto } from '../dto/create-coupon.dto';
import { UpdateCouponDto } from '../dto/update-coupon.dto';
export declare class CouponRepository extends BaseRepository<Coupon, CreateCouponDto, UpdateCouponDto> implements ICouponRepository {
    constructor(databaseService: DatabaseService);
    findByCode(code: string): Promise<Coupon | null>;
    findActiveCoupons(): Promise<Coupon[]>;
    incrementUsage(id: string): Promise<Coupon>;
}
