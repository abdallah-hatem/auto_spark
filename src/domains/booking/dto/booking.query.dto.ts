import { PaginationQueryDto } from '@/common/dto';
import { Booking } from '@prisma/client';

export class BookingsQueryDto extends PaginationQueryDto<Booking> {}
