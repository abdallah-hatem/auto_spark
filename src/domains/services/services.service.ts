import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ServiceRepository } from './repositories/services.repository';
import { CreateServiceDto } from './dto/create-service.dto';
import { Service } from './entities/service.entity';
import { Pagination } from '@/common/interfaces/api-response.interface';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(private readonly serviceRepository: ServiceRepository) {}

  async findAll(): Promise<Service[]> {
    return this.serviceRepository.findAll();
  }

  async findAllWithPagination(
    page: number,
    limit: number,
  ): Promise<Pagination<Service>> {
    return this.serviceRepository.findAllWithPagination(page, limit);
  }

  async findById(id: string): Promise<Service> {
    const service = await this.serviceRepository.findById(id);

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return service;
  }

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    const existingService = await this.serviceRepository.findByName(
      createServiceDto.name.toLowerCase(),
    );

    if (existingService) {
      throw new BadRequestException('Service already exists');
    }

    return this.serviceRepository.create({
      ...createServiceDto,
    });
  }

  async update(
    id: string,
    updateServiceDto: UpdateServiceDto,
  ): Promise<Service> {
    await this.findById(id);

    return this.serviceRepository.update(id, updateServiceDto);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);

    await this.serviceRepository.delete(id);
  }
}
