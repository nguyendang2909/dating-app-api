import { IsNotEmpty, IsString } from 'class-validator';

export class LoginByFacebookDto {
  @IsNotEmpty()
  @IsString()
  token: string;
}
