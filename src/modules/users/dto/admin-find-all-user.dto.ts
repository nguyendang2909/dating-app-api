import { IsEmail, IsEnum, IsOptional } from 'class-validator';
import { AdminFindAllDto } from 'src/commons/dto/admin-find-all.dto';

import { ERole } from '../users.enum';

export class AdminFindAllUsersDto extends AdminFindAllDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(ERole)
  role?: ERole;
}
