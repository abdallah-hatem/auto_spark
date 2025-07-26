import { DiscountType } from '@prisma/client';
export interface Coupon {
    id: string;
    code: string;
    description?: string;
    discount: number;
    type: DiscountType;
    maxUses?: number;
    uses: number;
    expiresAt?: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
