import mongoose from 'mongoose';

import { UserLeanDocument } from './entities/user.entity';

export type CurrentUser = UserLeanDocument & {
  _id: mongoose.Types.ObjectId;
  haveBasicInfo?: boolean;
};
