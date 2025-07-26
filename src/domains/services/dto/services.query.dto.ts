import { PaginationQueryDto } from '@/common/dto';
import { IsOptional, IsString } from 'class-validator';

export class ServicesQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  name?: string;
}
