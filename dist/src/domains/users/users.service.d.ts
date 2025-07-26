import { UserRepository } from '@/domains/users/repositories/user.repository';
import { CreateUserDto } from '@/domains/users/dto/create-user.dto';
import { UpdateUserDto } from '@/domains/users/dto/update-user.dto';
import { User } from '@/domains/users/entities/user.entity';
import { LoggerService } from '@/common/services/logger.service';
import { Pagination } from '@/common/interfaces/api-response.interface';
export declare class UsersService {
    private readonly userRepository;
    private readonly loggerService;
    constructor(userRepository: UserRepository, loggerService: LoggerService);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findAllWithPagination(page: number, limit: number): Promise<Pagination<User>>;
    findById(id: string): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    remove(id: string): Promise<void>;
}
