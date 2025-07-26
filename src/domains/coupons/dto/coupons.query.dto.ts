import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '@/common/dto';
import { DiscountType } from '@prisma/client';

export class CouponsQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  type?: DiscountType;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsDate()
  expiresAt?: Date;
}