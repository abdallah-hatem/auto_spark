import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/database/database.service';
import { BaseRepository } from '@/common/repositories/base.repository';
import { IServiceRepository } from '../interfaces/services-repository.interface';
import { Service } from '../entities/service.entity';
import { CreateServiceDto } from '../dto/create-service.dto';
import { UpdateServiceDto } from '../dto/update-service.dto';

@Injectable()
export class ServiceRepository
  extends BaseRepository<Service, CreateServiceDto, UpdateServiceDto>
  implements IServiceRepository
{
  constructor(databaseService: DatabaseService) {
    super(databaseService, 'service');
  }

  async findByName(name: string): Promise<Service | null> {
    return this.model.findFirst({
      where: { name },
    });
  }
}
