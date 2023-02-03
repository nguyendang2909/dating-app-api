import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

import { FindDto } from './find.dto';
import { FindManyDto } from './find-many.dto';

export class FindManyByLastIdDto extends FindManyDto {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) => new Types.ObjectId(value))
  _lastId?: string;
}
