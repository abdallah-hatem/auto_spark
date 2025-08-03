import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/database/database.service';
import { BaseRepository } from '@/common/repositories/base.repository';
import { IPaymentRepository } from '../interfaces/payment-repository.interface';
import { Payment } from '../entities/payment.entity';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { UpdatePaymentDto } from '../dto/update-payment.dto';

@Injectable()
export class PaymentRepository
  extends BaseRepository<Payment, CreatePaymentDto, UpdatePaymentDto>
  implements IPaymentRepository
{
  constructor(databaseService: DatabaseService) {
    super(databaseService, 'payment');
  }
}
