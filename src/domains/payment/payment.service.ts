import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { PaymentRepository } from './repositories/payment.repository';
import {
  CreatePaymentDto,
  createPaymentFromBookingDto,
} from './dto/create-payment.dto';
import { BookingService } from '../booking/booking.service';
import { BookingStatus } from '@prisma/client';
import { PaymentQueryDto } from './dto/payment.query.dto';

@Injectable()
export class PaymentService {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    @Inject(forwardRef(() => BookingService))
    private readonly bookingService: BookingService,
  ) {}

  async createPaymentFromBooking(
    createPaymenFromBookingtDto: createPaymentFromBookingDto,
  ) {
    // get booking
    const booking = await this.bookingService.findBookingById(
      createPaymenFromBookingtDto.bookingId,
    );

    // check if booking is found
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // check if booking is in progress because after payment booking will be completed
    if (booking.status !== BookingStatus.IN_PROGRESS) {
      throw new BadRequestException(
        'Booking is not in progress, cannot create payment',
      );
    }

    // create payment
    return this.paymentRepository.create({
      ...createPaymenFromBookingtDto,
      amount: booking.price,
      method: 'CASH',
      status: 'COMPLETED',
    });
  }

  async getAllPayments(query: PaymentQueryDto) {
    return this.paymentRepository.findAllWithPagination(
      query.page,
      query.limit,
      query.search,
    );
  }
}
