// src/auth/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { RoleName } from '../enums/role-name.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleName[]) => SetMetadata(ROLES_KEY, roles);
