import { UserRole } from '@/common/enums/user.enum';
import { CreateUserDto } from './create-user.dto';
export declare class CreateAdminUserDto extends CreateUserDto {
    role: UserRole;
}
