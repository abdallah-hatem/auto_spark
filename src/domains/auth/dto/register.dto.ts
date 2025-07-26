import { UserRole } from 'src/common/enums/user.enum';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { IsEnum, IsOptional } from 'class-validator';

export class RegisterDto extends CreateUserDto {
  @IsEnum([UserRole.CUSTOMER, UserRole.WASHER], {
    message: 'Role must be either CUSTOMER or WASHER'
  })
  @IsOptional()
  role?: UserRole.CUSTOMER | UserRole.WASHER = UserRole.CUSTOMER;
}
