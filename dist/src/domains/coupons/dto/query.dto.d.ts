import { PaginationQueryDto } from '@/common/dto';
import { DiscountType } from '@prisma/client';
export declare class QueryDto extends PaginationQueryDto {
    code?: string;
    type?: DiscountType;
    isActive?: boolean;
    expiresAt?: Date;
}
