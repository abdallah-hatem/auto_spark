import { PaymentMethod, PaymentStatus } from '@prisma/client';

export interface Payment {
  id: string;
  userId: string;
  bookingId: string;
  amount: number;
  method: PaymentMethod;
  transactionId?: string;
  status: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
}
