import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class FindDto {
  @ApiPropertyOptional({ type: [String] })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  fields: string[];
}
