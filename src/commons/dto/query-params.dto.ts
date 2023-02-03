import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class ParamsWithId {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @Transform(({ value }) => new Types.ObjectId(value))
  _id: Types.ObjectId;
}
