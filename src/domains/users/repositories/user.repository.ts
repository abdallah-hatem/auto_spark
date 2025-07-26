import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@/database/database.service';
import { BaseRepository } from '@/common/repositories/base.repository';
import { IUserRepository } from '../interfaces/user-repository.interface';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserRepository
  extends BaseRepository<User, CreateUserDto, UpdateUserDto>
  implements IUserRepository
{
  constructor(databaseService: DatabaseService) {
    super(databaseService, 'user');
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.model.findUnique({
      where: { email },
    });
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.model.findUnique({
      where: { phone },
    });
  }
}
