import { IsOptional, IsString } from 'class-validator';

export class FindOneDataInterestDto {
  @IsOptional()
  @IsString()
  tag?: string;

  @IsOptional()
  @IsString()
  title?: string;
}
