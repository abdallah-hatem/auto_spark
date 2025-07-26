import { IsEnum } from 'class-validator';
import { UserRole } from '@/common/enums/user.enum';
import { CreateUserDto } from './create-user.dto';

export class CreateAdminUserDto extends CreateUserDto {
  @IsEnum(UserRole)
  role: UserRole = UserRole.ADMIN;
}
