import { Type } from 'class-transformer';
import { IsObject, IsOptional, IsPositive, IsString, Max, Min } from 'class-validator';

type Where<T> = {
  [K in keyof T]?: T[K];
};

export class PaginationQueryDto<T> {
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @Min(1)
  @Max(50)
  limit: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsObject()
  where?: Where<T> | Record<string, any>;
}
