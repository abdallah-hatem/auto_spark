import { ServiceRepository } from './repositories/services.repository';
import { CreateServiceDto } from './dto/create-service.dto';
import { Service } from './entities/service.entity';
import { Pagination } from '@/common/interfaces/api-response.interface';
import { UpdateServiceDto } from './dto/update-service.dto';
export declare class ServicesService {
    private readonly serviceRepository;
    constructor(serviceRepository: ServiceRepository);
    findAll(): Promise<Service[]>;
    findAllWithPagination(page: number, limit: number): Promise<Pagination<Service>>;
    findById(id: string): Promise<Service>;
    create(createServiceDto: CreateServiceDto): Promise<Service>;
    update(id: string, updateServiceDto: UpdateServiceDto): Promise<Service>;
    delete(id: string): Promise<void>;
}
