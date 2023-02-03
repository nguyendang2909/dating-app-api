import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ConversationsModule } from '../conversations/conversations.module';
import { Message, messageSchema } from './entities/message.entity';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Message.name,
        schema: messageSchema,
      },
    ]),
    ConversationsModule,
  ],
  exports: [MessagesService],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
