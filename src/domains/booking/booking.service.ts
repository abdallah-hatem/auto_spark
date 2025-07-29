import { Injectable, NotFoundException } from '@nestjs/common';
import { BookingRepository } from './repositories/booking.repository';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking } from './entities/booking.entity';
import { BookingsQueryDto } from './dto/booking.query.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { UsersService } from '../users/users.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class BookingService {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly notificationsService: NotificationsService,
    private readonly usersService: UsersService,
  ) {}

  async createBooking(createBookingDto: CreateBookingDto): Promise<any> {
    // const booking = await this.bookingRepository.create(createBookingDto);

    // // Send notification to washer that a new booking has been created
    const washers = await this.usersService.findAllWithPagination({
      page: 1,
      limit: 20,
      role: UserRole.WASHER,
    });

    console.log(washers.data, 'washers');
    await this.notificationsService.sendToMultipleUsers({
      userIds: washers.data.map((washer) => washer.id),
      title: 'New booking',
      body: 'A new booking has been created',
    });
    // return booking;
  }

  async findAllBookingsWithPagination(query: BookingsQueryDto): Promise<{
    data: Booking[];
    total: number;
    page: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }> {
    const searchFields = [
      'customerId',
      'washerId',
      'serviceId',
      'couponId',
      'status',
      'scheduledAt',
      'lat',
      'lng',
      'address',
      'price',
      'originalPrice',
      'paymentId',
      'reviewId',
    ];
    const {} = query;
    return this.bookingRepository.findAllWithPagination(
      query.page,
      query.limit,
      query.search,
      searchFields,
      {},
    );
  }

  async findBookingById(id: string): Promise<Booking> {
    const booking = await this.bookingRepository.findById(id);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    return booking;
  }

  async updateBooking(
    id: string,
    updateBookingDto: UpdateBookingDto,
  ): Promise<Booking> {
    return this.bookingRepository.update(id, updateBookingDto);
  }

  async deleteBooking(id: string): Promise<void> {
    return this.bookingRepository.delete(id);
  }
}
