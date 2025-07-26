import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseUtil } from '@/common/utils/response.util';
import { Auth } from '@/domains/auth/decorators/auth.decorator';
import { Roles } from '@/domains/auth/decorators/roles.decorator';
import { RolesGuard } from '@/domains/auth/guards/roles.guard';
import { UserRole } from '@/common/enums/user.enum';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { Request } from 'express';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';

@Controller('users')
@UseGuards(RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @Auth()
  async getProfile(@GetUser() user: User, @Req() req: Request) {
    return ResponseUtil.success(
      user,
      'Profile retrieved successfully',
      200,
      req.url,
    );
  }
}
