import { Module } from '@nestjs/common';
import { ActivitiesModule } from 'src/activities/activities.module';

import { AuthModule } from '../auth/auth.module';
import { ConversationsModule } from '../conversations/conversations.module';
import { MessagesModule } from '../messages/messages.module';
import { ChatsGateway } from './chats.gateway';
import { ChatsService } from './chats.service';

@Module({
  imports: [AuthModule, ConversationsModule, MessagesModule, ActivitiesModule],
  providers: [ChatsGateway, ChatsService],
})
export class ChatsModule {}
