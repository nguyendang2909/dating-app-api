import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

import { PasswordDto } from './password.dto';

export class LoginByEmailDto extends PasswordDto {
  @ApiProperty({ default: 'nguyendang2909@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
