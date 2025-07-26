import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@/domains/users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { CreateAdminUserDto } from '@/domains/users/dto/create-admin-user.dto';
import { User } from '@/domains/users/entities/user.entity';
import { LoggerService } from '@/common/services/logger.service';
export interface AuthResult {
    access_token: string;
    user: Omit<User, 'password'> | Partial<User>;
}
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    private readonly loggerService;
    constructor(usersService: UsersService, jwtService: JwtService, loggerService: LoggerService);
    register(registerDto: RegisterDto): Promise<AuthResult>;
    login(loginDto: LoginDto): Promise<AuthResult>;
    createAdmin(createAdminDto: CreateAdminUserDto): Promise<AuthResult>;
    validateUser(email: string, password: string): Promise<User | null>;
    private filterUserResponse;
}
