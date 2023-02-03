import { Types } from 'mongoose';

import { FindDto } from './find.dto';

export class FindOneDto extends FindDto {
  _id?: Types.ObjectId;
}
