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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const user_repository_1 = require("./repositories/user.repository");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const log_decorator_1 = require("../../common/decorators/log.decorator");
const logger_service_1 = require("../../common/services/logger.service");
const bcrypt = require("bcryptjs");
let UsersService = class UsersService {
    userRepository;
    loggerService;
    constructor(userRepository, loggerService) {
        this.userRepository = userRepository;
        this.loggerService = loggerService;
    }
    async create(createUserDto) {
        if (createUserDto.email) {
            const existingUserByEmail = await this.userRepository.findByEmail(createUserDto.email);
            if (existingUserByEmail) {
                throw new common_1.ConflictException('User with this email already exists');
            }
        }
        const existingUserByPhone = await this.userRepository.findByPhone(createUserDto.phone);
        if (existingUserByPhone) {
            throw new common_1.ConflictException('User with this phone number already exists');
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const userData = {
            ...createUserDto,
            password: hashedPassword,
        };
        return this.userRepository.create(userData);
    }
    async findAll() {
        return this.userRepository.findAll();
    }
    async findAllWithPagination(page, limit) {
        return this.userRepository.findAllWithPagination(page, limit);
    }
    async findById(id) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async findByEmail(email) {
        return this.userRepository.findByEmail(email);
    }
    async update(id, updateUserDto) {
        await this.findById(id);
        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        return this.userRepository.update(id, updateUserDto);
    }
    async remove(id) {
        await this.findById(id);
        await this.userRepository.delete(id);
    }
};
exports.UsersService = UsersService;
__decorate([
    (0, log_decorator_1.Log)({
        action: 'create_user',
        extractContext: {
            fromArgs: log_decorator_1.LogExtractors.emailFromDto,
            fromResult: log_decorator_1.LogExtractors.userFromResult,
            fromError: log_decorator_1.LogExtractors.emailFromError,
        },
        messages: {
            start: 'Creating new user',
            success: 'User created successfully',
            error: 'User creation failed',
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersService.prototype, "create", null);
__decorate([
    (0, log_decorator_1.Log)({
        action: 'find_all_users',
        messages: {
            start: 'Fetching all users',
            success: 'All users fetched successfully',
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersService.prototype, "findAll", null);
__decorate([
    (0, log_decorator_1.Log)({
        action: 'find_users_paginated',
        extractContext: {
            fromArgs: (args) => ({ page: args[0], limit: args[1] }),
        },
        messages: {
            start: 'Fetching users with pagination',
            success: 'Paginated users fetched successfully',
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], UsersService.prototype, "findAllWithPagination", null);
__decorate([
    (0, log_decorator_1.Log)({
        action: 'find_user_by_id',
        extractContext: {
            fromArgs: log_decorator_1.LogExtractors.userIdFromArgs,
            fromResult: log_decorator_1.LogExtractors.userFromResult,
        },
        messages: {
            start: 'Finding user by ID',
            success: 'User found successfully',
            error: 'User not found',
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersService.prototype, "findById", null);
__decorate([
    (0, log_decorator_1.LogDebug)('find_user_by_email'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersService.prototype, "findByEmail", null);
__decorate([
    (0, log_decorator_1.Log)({
        action: 'update_user',
        extractContext: {
            fromArgs: (args) => ({
                userId: args[0],
                updateFields: Object.keys(args[1] || {}),
            }),
            fromResult: log_decorator_1.LogExtractors.userFromResult,
        },
        messages: {
            start: 'Updating user',
            success: 'User updated successfully',
            error: 'User update failed',
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UsersService.prototype, "update", null);
__decorate([
    (0, log_decorator_1.Log)({
        action: 'delete_user',
        extractContext: {
            fromArgs: log_decorator_1.LogExtractors.userIdFromArgs,
        },
        messages: {
            start: 'Deleting user',
            success: 'User deleted successfully',
            error: 'User deletion failed',
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersService.prototype, "remove", null);
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        logger_service_1.LoggerService])
], UsersService);
//# sourceMappingURL=users.service.js.map