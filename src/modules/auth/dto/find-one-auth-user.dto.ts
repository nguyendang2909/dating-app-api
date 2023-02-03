import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class FindOneAuthUserDto {
  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  facebookId?: string;

  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;
}
