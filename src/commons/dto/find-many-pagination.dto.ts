import { Type } from '@nestjs/common';
import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';

import { FindManyDto } from './find-many.dto';

export class FindManyPaginationDto extends FindManyDto {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsNumberString()
  page?: string;
}

export const FindManyPaginationType = <A>(obj: Type<A>) => {
  return IntersectionType(obj, FindManyPaginationDto);
};
