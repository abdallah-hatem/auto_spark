import { CouponRepository } from './repositories/coupons.repository';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { Coupon } from './entities/coupon.entity';
import { Pagination } from '@/common/interfaces/api-response.interface';
import { CouponsQueryDto } from './dto/coupons.query.dto';
export declare class CouponsService {
    private readonly couponRepository;
    constructor(couponRepository: CouponRepository);
    create(createCouponDto: CreateCouponDto): Promise<Coupon>;
    findAll(): Promise<Coupon[]>;
    findAllWithPagination(page: number, limit: number, search?: string, filter?: CouponsQueryDto): Promise<Pagination<Coupon>>;
    findOne(id: string): Promise<Coupon>;
    findByCode(code: string): Promise<Coupon>;
    findActiveCoupons(): Promise<Coupon[]>;
    update(id: string, updateCouponDto: UpdateCouponDto): Promise<Coupon>;
    remove(id: string): Promise<void>;
    validateAndUseCoupon(code: string): Promise<Coupon>;
}
