import {
  ValidateEmail,
  ValidatePassword,
  ValidateName,
  ValidatePhone,
} from '@/common/decorators/validation.decorators';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ValidateName(3)
  name: string;

  @ValidateEmail()
  email: string;

  @ValidatePassword()
  password: string;

  @ValidatePhone()
  phone: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsNumber()
  @IsOptional()
  lat?: number;

  @IsNumber()
  @IsOptional()
  lng?: number;

  @IsString()
  @IsOptional()
  deviceToken?: string | null;
}
