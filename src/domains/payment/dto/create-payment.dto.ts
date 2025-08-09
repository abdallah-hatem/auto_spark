import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';
import { PaymentMethod, PaymentStatus } from '@prisma/client';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  bookingId: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  method: PaymentMethod;

  @IsString()
  @IsOptional()
  transactionId?: string;

  @IsEnum(PaymentStatus)
  @IsNotEmpty()
  status: PaymentStatus;
}

export class createPaymentFromBookingDto {
  @IsString()
  @IsNotEmpty()
  bookingId: string;
}
