import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';
import { DtoFactory } from 'src/commons/lib/dto-factory.lib';

import { FindAllMessagesDto } from './find-all-messages.dto';

export class FindManyMessagesDto extends DtoFactory.findManyByLastId(
  FindAllMessagesDto,
) {
  @IsNotEmpty()
  @Transform(({ value }) => new Types.ObjectId(value))
  _conversationId: Types.ObjectId;
}
