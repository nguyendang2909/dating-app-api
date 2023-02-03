import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';
import { DtoFactory } from 'src/commons/lib/dto-factory.lib';

export class CreateConversation {}

export class CreateConversationDto extends DtoFactory.createOne(
  CreateConversation,
) {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @Transform(({ value }) => new Types.ObjectId(value))
  _targetUserId: Types.ObjectId;
}
