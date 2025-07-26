import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Request } from 'express';
import { CreateAdminUserDto } from '@/domains/users/dto/create-admin-user.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto, req: Request): Promise<import("../../common/interfaces/api-response.interface").ApiResponse<import("./auth.service").AuthResult>>;
    login(loginDto: LoginDto, req: Request): Promise<import("../../common/interfaces/api-response.interface").ApiResponse<import("./auth.service").AuthResult>>;
    me(req: Request): Promise<import("../../common/interfaces/api-response.interface").ApiResponse<never[]>>;
    createAdmin(createAdminDto: CreateAdminUserDto, req: Request): Promise<import("../../common/interfaces/api-response.interface").ApiResponse<import("./auth.service").AuthResult>>;
}
