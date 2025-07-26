import { IRepository } from '@/common/interfaces/repository.interface';
import { Service } from '../entities/service.entity';
import { CreateServiceDto } from '../dto/create-service.dto';
import { UpdateServiceDto } from '../dto/update-service.dto';

export interface IServiceRepository
  extends IRepository<Service, CreateServiceDto, UpdateServiceDto> {
  findByName(name: string): Promise<Service | null>;
}
