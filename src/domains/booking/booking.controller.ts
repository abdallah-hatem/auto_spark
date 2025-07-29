import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { BookingsQueryDto } from './dto/booking.query.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @Auth()
  async createBooking(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.createBooking(createBookingDto);
  }

  @Get()
  @Auth()
  async getBookings(@Query() query: BookingsQueryDto) {
    return this.bookingService.findAllBookingsWithPagination(query);
  }

  @Get(':id')
  @Auth()
  async getBookingById(@Param('id') id: string) {
    return this.bookingService.findBookingById(id);
  }

  @Put(':id')
  @Auth()
  async updateBooking(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    return this.bookingService.updateBooking(id, updateBookingDto);
  }

  @Delete(':id')
  @Auth()
  async deleteBooking(@Param('id') id: string) {
    return this.bookingService.deleteBooking(id);
  }
}
