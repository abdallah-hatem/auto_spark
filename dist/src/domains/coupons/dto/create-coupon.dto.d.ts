import { DiscountType } from '@prisma/client';
export declare class CreateCouponDto {
    code: string;
    description?: string;
    discount: number;
    type?: DiscountType;
    maxUses?: number;
    expiresAt?: Date;
    isActive?: boolean;
}
