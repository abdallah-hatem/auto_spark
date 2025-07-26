import { IRepository } from 'src/common/interfaces/repository.interface';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
export interface IUserRepository extends IRepository<User, CreateUserDto, UpdateUserDto> {
    findByEmail(email: string): Promise<User | null>;
    findByPhone(phone: string): Promise<User | null>;
}
