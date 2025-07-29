import { BookingRepository } from './repositories/booking.repository';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking } from './entities/booking.entity';
import { BookingsQueryDto } from './dto/booking.query.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { UsersService } from '../users/users.service';
export declare class BookingService {
    private readonly bookingRepository;
    private readonly notificationsService;
    private readonly usersService;
    constructor(bookingRepository: BookingRepository, notificationsService: NotificationsService, usersService: UsersService);
    createBooking(createBookingDto: CreateBookingDto): Promise<any>;
    findAllBookingsWithPagination(query: BookingsQueryDto): Promise<{
        data: Booking[];
        total: number;
        page: number;
        limit: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    }>;
    findBookingById(id: string): Promise<Booking>;
    updateBooking(id: string, updateBookingDto: UpdateBookingDto): Promise<Booking>;
    deleteBooking(id: string): Promise<void>;
}
