import { PaginationQueryDto } from '@/common/dto';
import { Payment } from '@prisma/client';

export class PaymentQueryDto extends PaginationQueryDto<Payment> {}
