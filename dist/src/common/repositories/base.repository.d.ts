import { DatabaseService } from '../../database/database.service';
import { IRepository } from '../interfaces/repository.interface';
export declare abstract class BaseRepository<T, CreateDto, UpdateDto> implements IRepository<T, CreateDto, UpdateDto> {
    protected readonly databaseService: DatabaseService;
    protected readonly modelName: string;
    constructor(databaseService: DatabaseService, modelName: string);
    protected get model(): any;
    create(data: CreateDto): Promise<T>;
    findAll(): Promise<T[]>;
    findAllWithPagination(page?: number, limit?: number): Promise<{
        data: T[];
        total: number;
        page: number;
        limit: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    }>;
    findById(id: string): Promise<T | null>;
    update(id: string, data: UpdateDto): Promise<T>;
    delete(id: string): Promise<void>;
}
