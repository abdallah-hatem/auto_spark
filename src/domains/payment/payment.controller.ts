import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentQueryDto } from './dto/payment.query.dto';
import { UserRole } from '@prisma/client';
import { Auth } from '../auth/decorators/auth.decorator';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  @Auth([UserRole.ADMIN])
  async getAllPayments(@Query() query: PaymentQueryDto) {
    return this.paymentService.getAllPayments(query);
  }
}
