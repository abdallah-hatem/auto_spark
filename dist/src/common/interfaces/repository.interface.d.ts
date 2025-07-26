export interface IRepository<T, CreateDto, UpdateDto> {
    create(data: CreateDto): Promise<T>;
    findAll(): Promise<T[]>;
    findAllWithPagination(page: number, limit: number): Promise<{
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
