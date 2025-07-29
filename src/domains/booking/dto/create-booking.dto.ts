import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsDateString,
  IsNotEmpty,
} from 'class-validator';
import { BookingStatus } from '@prisma/client';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsString()
  @IsOptional()
  washerId?: string;

  @IsString()
  @IsNotEmpty()
  serviceId: string;

  @IsEnum(BookingStatus)
  @IsNotEmpty()
  status: BookingStatus = BookingStatus.PENDING;

  @IsDateString()
  @IsOptional()
  scheduledAt?: Date;

  @IsNumber()
  @IsNotEmpty()
  lat: number;

  @IsNumber()
  @IsNotEmpty()
  lng: number;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  originalPrice: number;

  @IsString()
  @IsOptional()
  couponId?: string;

  @IsString()
  @IsOptional()
  paymentId?: string;

  @IsString()
  @IsOptional()
  reviewId?: string;
}
