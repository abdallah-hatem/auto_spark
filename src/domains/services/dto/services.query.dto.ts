import { PaginationQueryDto } from '@/common/dto';
import { Service } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';

export class ServicesQueryDto extends PaginationQueryDto<Service> {
  @IsOptional()
  @IsString()
  name?: string;
}
