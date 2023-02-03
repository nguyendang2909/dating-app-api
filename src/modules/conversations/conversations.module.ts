import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from '../users/users.module';
import { ConversationsController } from './conversations.controller';
import { ConversationsService } from './conversations.service';
import {
  Conversation,
  conversationSchema,
} from './entities/conversation.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Conversation.name, schema: conversationSchema },
    ]),
    UsersModule,
  ],
  exports: [ConversationsService],
  controllers: [ConversationsController],
  providers: [ConversationsService],
})
export class ConversationsModule {}
