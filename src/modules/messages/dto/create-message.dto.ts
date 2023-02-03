import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateMessageDto {
  @IsNotEmpty()
  @Transform(({ value }) => new Types.ObjectId(value))
  _conversationId: Types.ObjectId;

  @IsOptional()
  @IsString()
  text?: string;
}
