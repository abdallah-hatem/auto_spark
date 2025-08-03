import { IRepository } from '@/common/interfaces/repository.interface';
import { Payment } from '../entities/payment.entity';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { UpdatePaymentDto } from '../dto/update-payment.dto';

export interface IPaymentRepository
  extends IRepository<Payment, CreatePaymentDto, UpdatePaymentDto> {}
