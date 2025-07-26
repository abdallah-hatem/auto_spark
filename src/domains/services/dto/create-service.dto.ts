import { ValidateName } from '@/common/decorators/validation.decorators';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateServiceDto {
  @ValidateName(3)
  @IsString()
  @Transform(({ value }) => value?.toLowerCase())
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  price: number;
}
