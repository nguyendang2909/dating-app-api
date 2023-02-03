import { DtoFactory } from 'src/commons/lib/dto-factory.lib';

import { FindAllInterestDto } from './find-all-interest.dto';

export class FindManyInterestsDto extends DtoFactory.findMany(
  FindAllInterestDto,
) {}
