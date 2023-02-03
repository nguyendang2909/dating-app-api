import { Transform } from 'class-transformer';
import { IsNotEmpty, IsObject, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

import { UpdateOneDto } from './update-one.dto';

export class CreateOneDto extends UpdateOneDto {
  @IsNotEmpty()
  @Transform(({ value }) => new Types.ObjectId(value))
  createdBy: Types.ObjectId;
}
