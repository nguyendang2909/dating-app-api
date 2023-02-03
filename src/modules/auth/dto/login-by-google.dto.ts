import { IsNotEmpty, IsString } from 'class-validator';

export class LoginByGoogleDto {
  @IsNotEmpty()
  @IsString()
  token: string;
}
