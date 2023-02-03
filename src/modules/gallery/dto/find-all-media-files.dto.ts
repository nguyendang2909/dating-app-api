import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { FindAllDto } from 'src/commons/dto/find-all.dto';

import { EMediaType } from '../gallery.enum';

export class FindAllMediaFilesDto extends FindAllDto {
  @ApiPropertyOptional({ type: String, enum: EMediaType })
  @IsOptional()
  @IsEnum(EMediaType)
  type: EMediaType;
}
