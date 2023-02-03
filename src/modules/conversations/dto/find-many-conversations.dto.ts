import { DtoFactory } from 'src/commons/lib/dto-factory.lib';

import { FindAllConversationsDto } from './find-all-conversations.dto';

export class FindManyConversationsDto extends DtoFactory.findManyByLastId(
  FindAllConversationsDto,
) {}
