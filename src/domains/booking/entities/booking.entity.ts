import { BookingStatus } from '@prisma/client';

export interface Booking {
  id: string;
  customerId: string;
  washerId?: string;
  serviceId: string;
  couponId?: string;
  status: BookingStatus;
  scheduledAt: Date;
  lat: number;
  lng: number;
  address: string;
  price: number;
  originalPrice: number;
  paymentId?: string;
  reviewId?: string;
  createdAt: Date;
  updatedAt: Date;
}
