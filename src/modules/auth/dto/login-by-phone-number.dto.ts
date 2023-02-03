import { IsNotEmpty, IsString } from 'class-validator';

export class LoginByPhoneNumberDto {
  @IsNotEmpty()
  @IsString()
  token: string;
}
