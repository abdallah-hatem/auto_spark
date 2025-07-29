import { DatabaseService } from '@/database/database.service';
import { BaseRepository } from '@/common/repositories/base.repository';
import { IBookingRepository } from '../interfaces/booking-repository.interface';
import { Booking } from '../entities/booking.entity';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { UpdateBookingDto } from '../dto/update-booking.dto';
export declare class BookingRepository extends BaseRepository<Booking, CreateBookingDto, UpdateBookingDto> implements IBookingRepository {
    constructor(databaseService: DatabaseService);
}
