import { PaginationQueryDto } from '@/common/dto';
import { IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '@prisma/client';

export class UsersQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
