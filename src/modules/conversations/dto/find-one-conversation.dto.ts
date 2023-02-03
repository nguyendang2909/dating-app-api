import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { Types } from 'mongoose';
import { FindOneDto } from 'src/commons/dto/find-one.dto';

export class FindOneConversationDto extends FindOneDto {
  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @Transform(({ value }) => new Types.ObjectId(value))
  _userId?: Types.ObjectId;
}
