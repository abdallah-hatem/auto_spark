import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CouponRepository } from './repositories/coupons.repository';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { Coupon } from './entities/coupon.entity';
import { Pagination } from '@/common/interfaces/api-response.interface';
import { CouponsQueryDto } from './dto/coupons.query.dto';

@Injectable()
export class CouponsService {
  constructor(private readonly couponRepository: CouponRepository) {}

  async create(createCouponDto: CreateCouponDto): Promise<Coupon> {
    const existingCoupon = await this.couponRepository.findByCode(
      createCouponDto.code,
    );

    if (existingCoupon) {
      throw new BadRequestException('Coupon code already exists');
    }

    return this.couponRepository.create(createCouponDto);
  }

  async findAll(): Promise<Coupon[]> {
    return this.couponRepository.findAll();
  }

  async findAllWithPagination(
    page: number,
    limit: number,
    search?: string,
    filter?: CouponsQueryDto,
  ): Promise<Pagination<Coupon>> {
    console.log(filter, 'filter');
    const searchFields = ['code', 'description'];

    const { code, type, isActive, expiresAt } = filter || {};
    const where = {
      code,
      type,
      isActive,
      expiresAt,
    };
    return this.couponRepository.findAllWithPagination(
      page,
      limit,
      search,
      searchFields,
      where,
    );
  }

  async findOne(id: string): Promise<Coupon> {
    const coupon = await this.couponRepository.findById(id);
    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }
    return coupon;
  }

  async findByCode(code: string): Promise<Coupon> {
    const coupon = await this.couponRepository.findByCode(code);
    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }
    return coupon;
  }

  async findActiveCoupons(): Promise<Coupon[]> {
    return this.couponRepository.findActiveCoupons();
  }

  async update(id: string, updateCouponDto: UpdateCouponDto): Promise<Coupon> {
    const coupon = await this.findOne(id);

    if (updateCouponDto.code && updateCouponDto.code !== coupon.code) {
      const existingCoupon = await this.couponRepository.findByCode(
        updateCouponDto.code,
      );
      if (existingCoupon) {
        throw new BadRequestException('Coupon code already exists');
      }
    }

    return this.couponRepository.update(id, updateCouponDto);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.couponRepository.delete(id);
  }

  async validateAndUseCoupon(code: string): Promise<Coupon> {
    const coupon = await this.findByCode(code);

    if (!coupon.isActive) {
      throw new BadRequestException('Coupon is not active');
    }

    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      throw new BadRequestException('Coupon has expired');
    }

    if (coupon.maxUses && coupon.uses >= coupon.maxUses) {
      throw new BadRequestException('Coupon usage limit reached');
    }

    return this.couponRepository.incrementUsage(coupon.id);
  }
}
