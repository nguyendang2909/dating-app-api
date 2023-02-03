import { IsNotEmpty, IsString } from 'class-validator';

export class AdminCreateDataInterest {
  @IsNotEmpty()
  @IsString()
  tag: string;

  @IsNotEmpty()
  @IsString()
  title: string;
}

export class AdminCreateDataInterestDto extends AdminCreateDataInterest {}
