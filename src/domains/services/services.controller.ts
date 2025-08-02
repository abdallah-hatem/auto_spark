import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { Service } from './entities/service.entity';
import { Pagination } from '@/common/interfaces/api-response.interface';
import { Auth } from '@/domains/auth/decorators/auth.decorator';
import { CreateServiceDto } from './dto/create-service.dto';
import { IsAdmin } from '@/domains/auth/decorators/roles.decorator';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServicesQueryDto } from './dto/services.query.dto';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  @Auth()
  async findAll(
    @Query() query: ServicesQueryDto,
  ): Promise<Pagination<Service>> {
    return this.servicesService.findAllWithPagination(query);
  }

  @Post()
  @Auth()
  @IsAdmin()
  async create(@Body() createServiceDto: CreateServiceDto): Promise<Service> {
    return this.servicesService.create(createServiceDto);
  }

  // @Get(':id')
  // @Auth()
  // async findById(@Param('id') id: string): Promise<Service> {
  //   return this.servicesService.findById(id);
  // }

  @Put(':id')
  @Auth()
  @IsAdmin()
  async update(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ): Promise<Service> {
    return this.servicesService.update(id, updateServiceDto);
  }

  @Delete(':id')
  @Auth()
  @IsAdmin()
  async delete(@Param('id') id: string): Promise<void> {
    return this.servicesService.delete(id);
  }
}
