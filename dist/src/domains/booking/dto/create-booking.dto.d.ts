import { BookingStatus } from '@prisma/client';
export declare class CreateBookingDto {
    customerId: string;
    washerId?: string;
    serviceId: string;
    status: BookingStatus;
    scheduledAt?: Date;
    lat: number;
    lng: number;
    address: string;
    price: number;
    originalPrice: number;
    couponId?: string;
    paymentId?: string;
    reviewId?: string;
}
