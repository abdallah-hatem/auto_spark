import { IRepository } from '@/common/interfaces/repository.interface';
import { Booking } from '../entities/booking.entity';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { UpdateBookingDto } from '../dto/update-booking.dto';
export interface IBookingRepository extends IRepository<Booking, CreateBookingDto, UpdateBookingDto> {
}
