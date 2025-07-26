"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponsService = void 0;
const common_1 = require("@nestjs/common");
const coupons_repository_1 = require("./repositories/coupons.repository");
let CouponsService = class CouponsService {
    couponRepository;
    constructor(couponRepository) {
        this.couponRepository = couponRepository;
    }
    async create(createCouponDto) {
        const existingCoupon = await this.couponRepository.findByCode(createCouponDto.code);
        if (existingCoupon) {
            throw new common_1.BadRequestException('Coupon code already exists');
        }
        return this.couponRepository.create(createCouponDto);
    }
    async findAll() {
        return this.couponRepository.findAll();
    }
    async findAllWithPagination(page, limit, search, filter) {
        console.log(filter, 'filter');
        const searchFields = ['code', 'description'];
        const { code, type, isActive, expiresAt } = filter || {};
        const where = {
            code,
            type,
            isActive,
            expiresAt,
        };
        return this.couponRepository.findAllWithPagination(page, limit, search, searchFields, where);
    }
    async findOne(id) {
        const coupon = await this.couponRepository.findById(id);
        if (!coupon) {
            throw new common_1.NotFoundException('Coupon not found');
        }
        return coupon;
    }
    async findByCode(code) {
        const coupon = await this.couponRepository.findByCode(code);
        if (!coupon) {
            throw new common_1.NotFoundException('Coupon not found');
        }
        return coupon;
    }
    async findActiveCoupons() {
        return this.couponRepository.findActiveCoupons();
    }
    async update(id, updateCouponDto) {
        const coupon = await this.findOne(id);
        if (updateCouponDto.code && updateCouponDto.code !== coupon.code) {
            const existingCoupon = await this.couponRepository.findByCode(updateCouponDto.code);
            if (existingCoupon) {
                throw new common_1.BadRequestException('Coupon code already exists');
            }
        }
        return this.couponRepository.update(id, updateCouponDto);
    }
    async remove(id) {
        await this.findOne(id);
        await this.couponRepository.delete(id);
    }
    async validateAndUseCoupon(code) {
        const coupon = await this.findByCode(code);
        if (!coupon.isActive) {
            throw new common_1.BadRequestException('Coupon is not active');
        }
        if (coupon.expiresAt && new Date() > coupon.expiresAt) {
            throw new common_1.BadRequestException('Coupon has expired');
        }
        if (coupon.maxUses && coupon.uses >= coupon.maxUses) {
            throw new common_1.BadRequestException('Coupon usage limit reached');
        }
        return this.couponRepository.incrementUsage(coupon.id);
    }
};
exports.CouponsService = CouponsService;
exports.CouponsService = CouponsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [coupons_repository_1.CouponRepository])
], CouponsService);
//# sourceMappingURL=coupons.service.js.map