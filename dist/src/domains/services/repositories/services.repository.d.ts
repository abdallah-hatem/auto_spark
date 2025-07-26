import { DatabaseService } from '@/database/database.service';
import { BaseRepository } from '@/common/repositories/base.repository';
import { IServiceRepository } from '../interfaces/services-repository.interface';
import { Service } from '../entities/service.entity';
import { CreateServiceDto } from '../dto/create-service.dto';
import { UpdateServiceDto } from '../dto/update-service.dto';
export declare class ServiceRepository extends BaseRepository<Service, CreateServiceDto, UpdateServiceDto> implements IServiceRepository {
    constructor(databaseService: DatabaseService);
    findByName(name: string): Promise<Service | null>;
}
