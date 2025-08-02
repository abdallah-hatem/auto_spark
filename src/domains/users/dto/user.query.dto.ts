import { PaginationQueryDto } from '@/common/dto';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { User, UserRole } from '@prisma/client';

export class UsersQueryDto extends PaginationQueryDto<User> {
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}
