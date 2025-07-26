import { UserRole } from 'src/common/enums/user.enum';
import { CreateUserDto } from '../../users/dto/create-user.dto';
export declare class RegisterDto extends CreateUserDto {
    role?: UserRole.CUSTOMER | UserRole.WASHER;
}
