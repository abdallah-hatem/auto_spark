"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const login_dto_1 = require("./dto/login.dto");
const register_dto_1 = require("./dto/register.dto");
const log_decorator_1 = require("../../common/decorators/log.decorator");
const logger_service_1 = require("../../common/services/logger.service");
const bcrypt = require("bcryptjs");
const user_enum_1 = require("../../common/enums/user.enum");
let AuthService = class AuthService {
    usersService;
    jwtService;
    loggerService;
    constructor(usersService, jwtService, loggerService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.loggerService = loggerService;
    }
    async register(registerDto) {
        const user = await this.usersService.create(registerDto);
        const payload = { sub: user.id, email: user.email };
        return {
            access_token: this.jwtService.sign(payload),
            user: this.filterUserResponse(user),
        };
    }
    async login(loginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const payload = { sub: user.id, email: user.email };
        return {
            access_token: this.jwtService.sign(payload),
            user: this.filterUserResponse(user),
        };
    }
    async createAdmin(createAdminDto) {
        const user = await this.usersService.create(createAdminDto);
        const payload = { sub: user.id, email: user.email };
        return {
            access_token: this.jwtService.sign(payload),
            user: this.filterUserResponse(user),
        };
    }
    async validateUser(email, password) {
        const user = await this.usersService.findByEmail(email);
        if (user && (await bcrypt.compare(password, user.password))) {
            return user;
        }
        return null;
    }
    filterUserResponse(user) {
        const { password, ...userWithoutPassword } = user;
        if (user.role === user_enum_1.UserRole.CUSTOMER) {
            return {
                name: user.name,
                phone: user.phone,
                email: user.email,
                address: user.address,
                role: user.role,
            };
        }
        if (user.role === user_enum_1.UserRole.ADMIN) {
            return {
                name: user.name,
                phone: user.phone,
                email: user.email,
                role: user.role,
            };
        }
        return userWithoutPassword;
    }
};
exports.AuthService = AuthService;
__decorate([
    (0, log_decorator_1.Log)({
        action: 'register',
        extractContext: {
            fromArgs: log_decorator_1.LogExtractors.emailFromDto,
            fromResult: (result) => ({
                userId: result.user.id,
                email: result.user.email,
                name: result.user.name,
            }),
            fromError: log_decorator_1.LogExtractors.emailFromError,
        },
        messages: {
            start: 'Registration attempt started',
            success: 'User registered successfully',
            error: 'Registration failed',
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthService.prototype, "register", null);
__decorate([
    (0, log_decorator_1.Log)({
        action: 'login',
        extractContext: {
            fromArgs: (args) => ({ email: args[0]?.email }),
            fromResult: (result) => ({
                userId: result.user.id,
                email: result.user.email,
            }),
            fromError: (error, args) => ({
                email: args[0]?.email,
                errorMessage: error.message,
            }),
        },
        messages: {
            start: 'Login attempt started',
            success: 'User logged in successfully',
            error: 'Login failed',
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthService.prototype, "login", null);
__decorate([
    (0, log_decorator_1.LogDebug)('validate_user'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthService.prototype, "validateUser", null);
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        logger_service_1.LoggerService])
], AuthService);
//# sourceMappingURL=auth.service.js.map