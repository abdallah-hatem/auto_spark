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
import { CouponsService } from './coupons.service';
import { Coupon } from './entities/coupon.entity';
import { Pagination } from '@/common/interfaces/api-response.interface';
import { Auth } from '@/domains/auth/decorators/auth.decorator';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { IsAdmin } from '@/domains/auth/decorators/roles.decorator';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { CouponsQueryDto } from './dto/coupons.query.dto';

@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Post()
  @Auth()
  @IsAdmin()
  async create(@Body() createCouponDto: CreateCouponDto): Promise<Coupon> {
    return this.couponsService.create(createCouponDto);
  }

  @Get()
  @Auth()
  async findAll(@Query() query: CouponsQueryDto): Promise<Pagination<Coupon>> {
    return this.couponsService.findAllWithPagination(
      query.page,
      query.limit,
      query.search,
      query,
    );
  }

  @Get('active')
  @Auth()
  async findActiveCoupons(): Promise<Coupon[]> {
    return this.couponsService.findActiveCoupons();
  }

  @Get('code/:code')
  @Auth()
  async findByCode(@Param('code') code: string): Promise<Coupon> {
    return this.couponsService.findByCode(code);
  }

  @Post('validate/:code')
  @Auth()
  async validateCoupon(@Param('code') code: string): Promise<Coupon> {
    return this.couponsService.validateAndUseCoupon(code);
  }

  @Get(':id')
  @Auth()
  async findOne(@Param('id') id: string): Promise<Coupon> {
    return this.couponsService.findOne(id);
  }

  @Put(':id')
  @Auth()
  @IsAdmin()
  async update(
    @Param('id') id: string,
    @Body() updateCouponDto: UpdateCouponDto,
  ): Promise<Coupon> {
    return this.couponsService.update(id, updateCouponDto);
  }

  @Delete(':id')
  @Auth()
  @IsAdmin()
  async remove(@Param('id') id: string): Promise<void> {
    return this.couponsService.remove(id);
  }
}
