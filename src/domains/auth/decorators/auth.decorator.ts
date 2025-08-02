import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../guards/roles.guard';
import { UserRole } from '@prisma/client';

export const ROLES_KEY = 'roles';

export function Auth(
  roles: UserRole[] = [UserRole.ADMIN, UserRole.WASHER, UserRole.CUSTOMER],
) {
  return applyDecorators(
    UseGuards(AuthGuard('jwt'), RolesGuard),
    SetMetadata(ROLES_KEY, roles),
  );
}
