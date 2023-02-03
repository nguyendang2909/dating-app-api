import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

import { FindDto } from './find.dto';

export class FindManyDto extends FindDto {
  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsString()
  pageSize?: string;
}
