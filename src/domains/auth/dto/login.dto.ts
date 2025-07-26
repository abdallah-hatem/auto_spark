import {
  ValidateEmail,
  ValidatePassword,
} from '@/common/decorators/validation.decorators';

export class LoginDto {
  @ValidateEmail()
  email: string;

  @ValidatePassword()
  password: string;
}
