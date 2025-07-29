import { BookingStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateBookingDto {
  @IsEnum(BookingStatus)
  @IsNotEmpty()
  status: BookingStatus = BookingStatus.PENDING;
}
