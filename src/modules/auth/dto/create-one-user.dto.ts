import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { DtoFactory } from 'src/commons/lib/dto-factory.lib';

export class CreateOneUser {
  @IsOptional()
  @IsEmail()
  googleEmail?: string;

  @IsOptional()
  @IsString()
  facebookId?: string;

  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;
}

export class CreateOneUserDto extends CreateOneUser {}
