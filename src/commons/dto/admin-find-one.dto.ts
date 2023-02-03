import { Types } from 'mongoose';

import { AdminFindDto } from './admin-find.dto';

export class AdminFindOneDto extends AdminFindDto {
  _id: Types.ObjectId;
}
