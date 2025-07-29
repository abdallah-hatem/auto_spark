import { PaginationQueryDto } from '@/common/dto';
import { UserRole } from '@prisma/client';
export declare class UsersQueryDto extends PaginationQueryDto {
    role?: UserRole;
}
