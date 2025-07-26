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

  async findAllWithPagination(
    page: number = 1,
    limit: number = 10,
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

    const data = await this.model.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await this.model.count();
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
