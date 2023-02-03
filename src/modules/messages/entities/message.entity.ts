import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { MongoLeanDocument } from 'src/commons/mongo-types.common';
import { BaseSchema } from 'src/commons/schemas.common';
import {
  Conversation,
  ConversationLeanDocument,
} from 'src/modules/conversations/entities/conversation.entity';
import { UserLeanDocument } from 'src/modules/users/entities/user.entity';

@Schema({ timestamps: true })
export class Message extends BaseSchema {
  @Prop({
    index: true,
    ref: Conversation.name,
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  _conversationId: mongoose.Types.ObjectId;

  @Prop({ type: String })
  text?: string;

  conversation?: ConversationLeanDocument;
}

export type MessageLeanDocument = MongoLeanDocument<Message>;

export const messageSchema = SchemaFactory.createForClass(Message);
