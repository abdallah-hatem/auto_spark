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
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User, UserRole } from '@prisma/client';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @Auth([UserRole.CUSTOMER, UserRole.ADMIN])
  async createBooking(
    @Body() createBookingDto: CreateBookingDto,
    @GetUser() user: User,
  ) {
    return this.bookingService.createBooking(createBookingDto, user);
  }

  @Get()
  @Auth([UserRole.ADMIN])
  async getBookings(@Query() query: BookingsQueryDto) {
    return this.bookingService.findAllBookingsWithPagination(query);
  }

  @Get(':id')
  @Auth([UserRole.ADMIN])
  async getBookingById(@Param('id') id: string) {
    return this.bookingService.findBookingById(id);
  }

  @Put(':id')
  @Auth()
  async updateBooking(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
    @GetUser() user: User,
  ) {
    return this.bookingService.updateBooking(id, updateBookingDto, user);
  }

  @Delete(':id')
  @Auth([UserRole.ADMIN])
  async deleteBooking(@Param('id') id: string) {
    return this.bookingService.deleteBooking(id);
  }
}
