import { SetMetadata } from '@nestjs/common';
import { ERole } from 'src/modules/users/users.enum';

export const RequireRoles = (roles: ERole[]) => SetMetadata('roles', roles);
