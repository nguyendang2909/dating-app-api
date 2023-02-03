import { AdminFindAllDto } from 'src/commons/dto/admin-find-all.dto';
import { FindManyPaginationType } from 'src/commons/dto/find-many-pagination.dto';

import { AdminFindAllUsersDto } from './admin-find-all-user.dto';

export class AdminFindManyUsersDto extends FindManyPaginationType(
  AdminFindAllUsersDto,
) {}
