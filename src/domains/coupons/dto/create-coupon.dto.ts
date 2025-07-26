import { IsString, IsOptional, IsNumber, IsEnum, IsBoolean, IsDateString, IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { DiscountType } from '@prisma/client';
import { IsFutureDate } from '@/common/decorators';

export class CreateCouponDto {
  @IsString()
  @Transform(({ value }) => value?.toUpperCase())
  code: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  discount: number;

  @IsEnum(DiscountType)
  @IsOptional()
  type?: DiscountType = DiscountType.FLAT;

  @IsInt()
  @Min(1)
  @IsOptional()
  maxUses?: number;

  @IsOptional()
  @Transform(({ value }) => value ? new Date(value) : undefined)
  @IsFutureDate()
  expiresAt?: Date;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;
} 