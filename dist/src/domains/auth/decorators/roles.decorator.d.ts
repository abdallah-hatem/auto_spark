import { UserRole } from '@/common/enums/user.enum';
export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: UserRole[]) => import("@nestjs/common").CustomDecorator<string>;
export declare const IsAdmin: () => import("@nestjs/common").CustomDecorator<string>;
