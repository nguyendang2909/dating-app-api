import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { MongoLeanDocument } from 'src/commons/mongo-types.common';
import { BaseSchema } from 'src/commons/schemas.common';
import { User, UserLeanDocument } from 'src/modules/users/entities/user.entity';

import { EConversationType } from '../conversations.enum';

@Schema({ timestamps: true })
export class Conversation extends BaseSchema {
  @Prop({ default: EConversationType.dicrect, required: true, type: String })
  type?: EConversationType;

  @Prop({
    required: true,
    type: [mongoose.Schema.Types.ObjectId],
    ref: User.name,
  })
  _userIds: Types.ObjectId[];

  @Prop({ default: false, required: true, type: Boolean })
  isRead?: boolean;

  members?: UserLeanDocument[];
}

export const conversationSchema = SchemaFactory.createForClass(Conversation);

export type ConversationLeanDocument = MongoLeanDocument<Conversation>;

conversationSchema.virtual('members', {
  ref: User.name,
  localField: '_userIds',
  foreignField: '_id',
});

conversationSchema.virtual('lastMessage', {
  ref: 'Message',
  localField: '_id',
  foreignField: '_conversationId',
  justOne: true,
  options: {
    sort: {
      _id: -1,
    },
  },
});

conversationSchema.set('toObject', { virtuals: true });

conversationSchema.set('toJSON', { virtuals: true });
