import { UserRepository } from '@/domains/users/repositories/user.repository';
import { CreateUserDto } from '@/domains/users/dto/create-user.dto';
import { UpdateUserDto } from '@/domains/users/dto/update-user.dto';
import { User } from '@/domains/users/entities/user.entity';
import { UsersQueryDto } from './dto/user.query.dto';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: UserRepository);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findAllWithPagination(query: UsersQueryDto): Promise<{
        data: User[];
        total: number;
        page: number;
        limit: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    }>;
    findById(id: string): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    remove(id: string): Promise<void>;
}
