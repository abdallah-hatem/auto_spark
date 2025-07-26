import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { IRepository } from '../interfaces/repository.interface';

@Injectable()
export abstract class BaseRepository<T, CreateDto, UpdateDto>
  implements IRepository<T, CreateDto, UpdateDto>
{
  constructor(
    protected readonly databaseService: DatabaseService,
    protected readonly modelName: string,
  ) {}

  protected get model() {
    return this.databaseService[this.modelName];
  }

  async create(data: CreateDto): Promise<T> {
    return this.model.create({
      data,
    });
  }

  async findAll(): Promise<T[]> {
    return this.model.findMany();
  }

  /**
   * Generic pagination with search functionality.
   * Each repository can override this method to define their own searchable fields.
   *
   * @param page - Page number (starts from 1)
   * @param limit - Number of items per page (max 20)
   * @param search - Search term (optional)
   * @param searchFields - Array of field names to search in (optional)
   * @returns Paginated results with metadata
   *
   * @example
   * // In a specific repository:
   * async findAllWithPagination(page = 1, limit = 10, search?) {
   *   const searchFields = ['name', 'email', 'phone'];
   *   return super.findAllWithPagination(page, limit, search, searchFields);
   * }
   */
  async findAllWithPagination(
    page: number = 1,
    limit: number = 10,
    search?: string,
    searchFields?: string[],
    where?: any,
  ): Promise<{
    data: T[];
    total: number;
    page: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }> {
    if (limit > 20) {
      limit = 20;
    }

    // Build search conditions dynamically
    const whereCondition: any = {
      ...where,
    };

    if (search && searchFields && searchFields.length > 0) {
      whereCondition.OR = searchFields.map((field) => ({
        [field]: { contains: search, mode: 'insensitive' },
      }));
    }

    const data = await this.model.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: whereCondition,
    });

    const total = await this.model.count({
      where: whereCondition,
    });

    const hasNextPage = page * limit < total;
    const hasPreviousPage = page > 1;

    return {
      data,
      total,
      page,
      limit,
      hasNextPage,
      hasPreviousPage,
    };
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: UpdateDto): Promise<T> {
    return this.model.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.model.delete({
      where: { id },
    });
  }
}
