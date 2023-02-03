import { IsOptional, IsString } from 'class-validator';

export class FindAllDataInterestDto {
  @IsOptional()
  @IsString()
  tag?: string;

  @IsOptional()
  @IsString()
  title?: string;
}
