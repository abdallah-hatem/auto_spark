import { ServicesService } from './services.service';
import { Service } from './entities/service.entity';
import { Pagination } from '@/common/interfaces/api-response.interface';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServicesQueryDto } from './dto/services.query.dto';
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
    findAll(query: ServicesQueryDto): Promise<Pagination<Service>>;
    create(createServiceDto: CreateServiceDto): Promise<Service>;
    update(id: string, updateServiceDto: UpdateServiceDto): Promise<Service>;
    delete(id: string): Promise<void>;
}
