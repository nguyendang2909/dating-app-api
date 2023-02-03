import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateOneDto {
  @IsNotEmpty()
  @Transform(({ value }) => new Types.ObjectId(value))
  updatedBy: Types.ObjectId;
}
