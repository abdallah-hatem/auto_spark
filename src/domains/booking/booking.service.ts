import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookingRepository } from './repositories/booking.repository';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking } from './entities/booking.entity';
import { BookingsQueryDto } from './dto/booking.query.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { UsersService } from '../users/users.service';
import { BookingStatus, User, UserRole } from '@prisma/client';

@Injectable()
export class BookingService {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly notificationsService: NotificationsService,
    private readonly usersService: UsersService,
  ) {}

  async createBooking(
    createBookingDto: CreateBookingDto,
    user: User,
  ): Promise<any> {
    // Create booking
    const booking = await this.bookingRepository.create({
      ...createBookingDto,
      customerId: user.id,
    });

    // get washers that have device token and are available paginated
    const washers = await this.usersService.findAllWithPagination({
      page: 1,
      limit: 20,
      role: UserRole.WASHER,
      isAvailable: true,
      where: {
        deviceToken: {
          not: null,
        },
      },
    });

    // Send notification to washers that a new booking has been created
    await this.notificationsService.sendToMultipleUsers({
      userIds: washers.data.map((washer) => washer.id),
      title: 'New booking',
      body: 'A new booking has been created',
      data: {
        bookingId: booking.id,
      },
    });

    return booking;
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
    user: User,
  ): Promise<Booking> {
    // check if booking exists
    const booking = await this.bookingRepository.findById(id);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // check if booking is assigned to a different washer
    if (booking.washerId && booking.washerId !== user.id) {
      throw new BadRequestException(
        'Booking is already assigned to a different washer',
      );
    }

    // handle status change
    this.handleStatusChange(booking.status, updateBookingDto.status, user);

    const payload = {
      ...updateBookingDto,
      washerId: user.id,
    };

    // update booking
    return this.bookingRepository.update(id, payload);
  }

  async deleteBooking(id: string): Promise<void> {
    return this.bookingRepository.delete(id);
  }

  private handleStatusChange(
    oldStatus: BookingStatus,
    newStatus: BookingStatus,
    user: User,
  ): BookingStatus {
    const isAdmin = user.role === UserRole.ADMIN;
    const isWasher = user.role === UserRole.WASHER;
    const isCustomer = user.role === UserRole.CUSTOMER;

    // If status is CANCELLED, no further changes allowed (except by admin)
    if (oldStatus === BookingStatus.CANCELLED && !isAdmin) {
      throw new BadRequestException('Cannot modify a cancelled booking');
    }

    // If trying to cancel, allow it for all roles
    if (newStatus === BookingStatus.CANCELLED) {
      return BookingStatus.CANCELLED;
    }

    // Admin can change to any status
    if (isAdmin) {
      return newStatus;
    }

    // Define valid status transitions
    const validTransitions: Record<BookingStatus, BookingStatus[]> = {
      [BookingStatus.PENDING]: [
        BookingStatus.ACCEPTED,
        BookingStatus.CANCELLED,
      ],
      [BookingStatus.ACCEPTED]: [
        BookingStatus.IN_PROGRESS,
        BookingStatus.CANCELLED,
      ],
      [BookingStatus.IN_PROGRESS]: [BookingStatus.COMPLETED],
      [BookingStatus.COMPLETED]: [BookingStatus.COMPLETED], // No further changes
      [BookingStatus.CANCELLED]: [BookingStatus.CANCELLED], // No further changes
    };

    // Check if the transition is valid
    const allowedTransitions = validTransitions[oldStatus];
    if (!allowedTransitions.includes(newStatus)) {
      throw new BadRequestException(
        `Invalid status transition from ${oldStatus} to ${newStatus}. Allowed transitions: ${allowedTransitions.join(', ')}`,
      );
    }

    // Role-specific validations
    if (isWasher) {
      // Washers can only accept pending bookings or complete in-progress bookings
      if (
        oldStatus === BookingStatus.PENDING &&
        newStatus === BookingStatus.ACCEPTED
      ) {
        return BookingStatus.ACCEPTED;
      }
      if (
        oldStatus === BookingStatus.ACCEPTED &&
        newStatus === BookingStatus.IN_PROGRESS
      ) {
        return BookingStatus.IN_PROGRESS;
      }
      if (
        oldStatus === BookingStatus.IN_PROGRESS &&
        newStatus === BookingStatus.COMPLETED
      ) {
        return BookingStatus.COMPLETED;
      }
      throw new BadRequestException(
        'Washer can only accept pending bookings, start in-progress bookings, or complete in-progress bookings',
      );
    }

    if (isCustomer) {
      // Customers cannot change booking status - only view
      throw new BadRequestException('Customers cannot modify booking status');
    }

    // If we reach here, the transition is not allowed for this role
    throw new BadRequestException(
      `Role ${user.role} cannot perform this status transition`,
    );
  }
}
