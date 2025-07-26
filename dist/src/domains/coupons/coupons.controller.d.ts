import { CouponsService } from './coupons.service';
import { Coupon } from './entities/coupon.entity';
import { Pagination } from '@/common/interfaces/api-response.interface';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { CouponsQueryDto } from './dto/coupons.query.dto';
export declare class CouponsController {
    private readonly couponsService;
    constructor(couponsService: CouponsService);
    create(createCouponDto: CreateCouponDto): Promise<Coupon>;
    findAll(query: CouponsQueryDto): Promise<Pagination<Coupon>>;
    findActiveCoupons(): Promise<Coupon[]>;
    findByCode(code: string): Promise<Coupon>;
    validateCoupon(code: string): Promise<Coupon>;
    findOne(id: string): Promise<Coupon>;
    update(id: string, updateCouponDto: UpdateCouponDto): Promise<Coupon>;
    remove(id: string): Promise<void>;
}
