import { DtoFactory } from 'src/commons/lib/dto-factory.lib';

import { FindAllMediaFilesDto } from './find-all-media-files.dto';

export class FindManyMediaFilesDto extends DtoFactory.findMany(
  FindAllMediaFilesDto,
) {}
