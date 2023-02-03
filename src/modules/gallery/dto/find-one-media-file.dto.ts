import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { FindDto } from 'src/commons/dto/find.dto';

export class FindOneMediaFileByIdDto extends FindDto {}
