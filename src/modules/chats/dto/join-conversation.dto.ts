import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import mongoose from 'mongoose';

export class JoinConversationDto {
  @IsOptional()
  @Transform(({ value }) => new mongoose.Types.ObjectId(value))
  _targetUserId?: mongoose.Types.ObjectId;

  @IsOptional()
  @Transform(({ value }) => new mongoose.Types.ObjectId(value))
  _id?: mongoose.Types.ObjectId;
}
