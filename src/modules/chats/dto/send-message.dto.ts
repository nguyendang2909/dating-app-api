import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendMessageDto {
  @IsNotEmpty()
  @IsString()
  conversationId!: string;

  @IsOptional()
  @IsString()
  text?: string;

  // @IsOptional()
  // @IsString({ each: true })
  // image?: string;

  // @IsOptional()
  // @IsString({ each: true })
  // video?: string;
}
