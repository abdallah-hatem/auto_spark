import { DatabaseService } from '@/database/database.service';
import { BaseRepository } from '@/common/repositories/base.repository';
import { IUserRepository } from '../interfaces/user-repository.interface';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
export declare class UserRepository extends BaseRepository<User, CreateUserDto, UpdateUserDto> implements IUserRepository {
    constructor(databaseService: DatabaseService);
    findByEmail(email: string): Promise<User | null>;
    findByPhone(phone: string): Promise<User | null>;
}
