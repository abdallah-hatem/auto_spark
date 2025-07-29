import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingsQueryDto } from './dto/booking.query.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
export declare class BookingController {
    private readonly bookingService;
    constructor(bookingService: BookingService);
    createBooking(createBookingDto: CreateBookingDto): Promise<any>;
    getBookings(query: BookingsQueryDto): Promise<{
        data: import("./entities/booking.entity").Booking[];
        total: number;
        page: number;
        limit: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    }>;
    getBookingById(id: string): Promise<import("./entities/booking.entity").Booking>;
    updateBooking(id: string, updateBookingDto: UpdateBookingDto): Promise<import("./entities/booking.entity").Booking>;
    deleteBooking(id: string): Promise<void>;
}
