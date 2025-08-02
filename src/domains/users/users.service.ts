import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UserRepository } from '@/domains/users/repositories/user.repository';
import { CreateUserDto } from '@/domains/users/dto/create-user.dto';
import { UpdateUserDto } from '@/domains/users/dto/update-user.dto';
import { User } from '@/domains/users/entities/user.entity';
import {
  Log,
  LogDebug,
  LogExtractors,
} from '@/common/decorators/log.decorator';
import { LoggerService } from '@/common/services/logger.service';
import * as bcrypt from 'bcryptjs';
import { Pagination } from '@/common/interfaces/api-response.interface';
import { Booking } from '@prisma/client';
import { BookingsQueryDto } from '../booking/dto/booking.query.dto';
import { UsersQueryDto } from './dto/user.query.dto';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  @Log({
    action: 'create_user',
    extractContext: {
      fromArgs: LogExtractors.emailFromDto,
      fromResult: LogExtractors.userFromResult,
      fromError: LogExtractors.emailFromError,
    },
    messages: {
      start: 'Creating new user',
      success: 'User created successfully',
      error: 'User creation failed',
    },
  })
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if user already exists by email
    if (createUserDto.email) {
      const existingUserByEmail = await this.userRepository.findByEmail(
        createUserDto.email,
      );
      if (existingUserByEmail) {
        throw new ConflictException('User with this email already exists');
      }
    }

    // Check if user already exists by phone
    const existingUserByPhone = await this.userRepository.findByPhone(
      createUserDto.phone,
    );
    if (existingUserByPhone) {
      throw new ConflictException('User with this phone number already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Create user with hashed password
    const userData = {
      ...createUserDto,
      password: hashedPassword,
    };

    return this.userRepository.create(userData);
  }

  @Log({
    action: 'find_all_users',
    messages: {
      start: 'Fetching all users',
      success: 'All users fetched successfully',
    },
  })
  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  @Log({
    action: 'find_users_paginated',
    extractContext: {
      fromArgs: (args) => ({ page: args[0], limit: args[1] }),
    },
    messages: {
      start: 'Fetching users with pagination',
      success: 'Paginated users fetched successfully',
    },
  })
  async findAllWithPagination(query: UsersQueryDto): Promise<{
    data: User[];
    total: number;
    page: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }> {
    const searchFields = [];
    const { role, where } = query;
    return this.userRepository.findAllWithPagination(
      query.page,
      query.limit,
      query.search,
      searchFields,
      {
        role,
        ...where,
      },
    );
  }

  @Log({
    action: 'find_user_by_id',
    extractContext: {
      fromArgs: LogExtractors.userIdFromArgs,
      fromResult: LogExtractors.userFromResult,
    },
    messages: {
      start: 'Finding user by ID',
      success: 'User found successfully',
      error: 'User not found',
    },
  })
  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @LogDebug('find_user_by_email')
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  @Log({
    action: 'update_user',
    extractContext: {
      fromArgs: (args) => ({
        userId: args[0],
        updateFields: Object.keys(args[1] || {}),
      }),
      fromResult: LogExtractors.userFromResult,
    },
    messages: {
      start: 'Updating user',
      success: 'User updated successfully',
      error: 'User update failed',
    },
  })
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // Check if user exists
    await this.findById(id);

    // If password is being updated, hash it
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    return this.userRepository.update(id, updateUserDto);
  }

  @Log({
    action: 'delete_user',
    extractContext: {
      fromArgs: LogExtractors.userIdFromArgs,
    },
    messages: {
      start: 'Deleting user',
      success: 'User deleted successfully',
      error: 'User deletion failed',
    },
  })
  async remove(id: string): Promise<void> {
    // Check if user exists
    await this.findById(id);
    await this.userRepository.delete(id);
  }
}
