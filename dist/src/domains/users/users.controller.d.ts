import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Request } from 'express';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(user: User, req: Request): Promise<import("../../common/interfaces/api-response.interface").ApiResponse<User>>;
    updateUser(id: string, body: UpdateUserDto): Promise<User>;
}
