import { BadRequestException, Injectable } from '@nestjs/common';
import { FlattenMaps, LeanDocument, Types } from 'mongoose';
import { Socket } from 'socket.io';

import { ConversationsService } from '../conversations/conversations.service';
import {
  Conversation,
  ConversationLeanDocument,
} from '../conversations/entities/conversation.entity';
import { MessagesService } from '../messages/messages.service';
import { JoinConversationDto } from './dto/join-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class ChatsService {
  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly messagesService: MessagesService,
  ) {}

  async joinConversation(
    joinConversationDto: JoinConversationDto,
    client: Socket,
  ) {
    const { _targetUserId, _id } = joinConversationDto;

    if (!_targetUserId && !_id) {
      throw new BadRequestException('Dữ liệu đầu vào không đúng');
    }

    const _currentUserId = client.handshake.user._id;

    let conversation!:
      | ConversationLeanDocument
      | FlattenMaps<LeanDocument<Conversation>>;

    if (_id) {
      conversation = await this.conversationsService.findOneOrFailById(
        _id,
        client.handshake.user._id,
      );
    } else if (_targetUserId) {
      const findConversationByUserId = await this.conversationsService.findOne(
        {
          _userId: _targetUserId,
          fields: [
            '_id',
            'type',
            '_userIds',
            'members',
            'isActive',
            'isRead',
            'createdAt',
            'updatedAt',
          ],
        },
        client.handshake.user._id,
      );

      if (findConversationByUserId) {
        conversation = findConversationByUserId;
      } else {
        conversation = await this.conversationsService.create(
          {
            _targetUserId,
            createdBy: _currentUserId,
            updatedBy: _currentUserId,
          },
          client.handshake.user._id,
        );
      }
    }

    if (!conversation) {
      throw new BadRequestException();
    }

    if ('_id' in conversation) {
      const conversationId = conversation._id.toString();

      client.join(conversationId);

      client.emit('joinedConversation', {
        ...conversation,
      });
    } else {
      return;
    }
  }

  public async sendMessage(sendMessageDto: SendMessageDto, client: Socket) {
    const { text, conversationId } = sendMessageDto;

    const _conversationId = new Types.ObjectId(conversationId);

    const { _id: _currentUserId } = client.handshake.user;

    const conversation = await this.conversationsService.findOneById(
      _conversationId,
      client.handshake.user,
    );

    if (!conversation) {
      client.emit('error', {
        message: 'Conversation not found',
        status: 404,
        type: 'conversation',
      });

      return;
    }

    const message = await this.messagesService.create(
      {
        text,
        _conversationId: new Types.ObjectId(conversationId),
      },
      client.handshake.user,
    );

    // const messageToEmit = {
    //   ...message,
    //   sender: {
    //     _id: currentUser,
    //   },
    // };
    // client.to(client.handshake.user._id).emit('message', { text });

    const currentUserId = _currentUserId.toString();

    client.emit('message', message);

    client.to(currentUserId).emit('message', message);

    const targetUsers = conversation.members;

    console.log(targetUsers);

    if (targetUsers) {
      for (const targetUser of targetUsers) {
        const targetUserId = targetUser._id?.toString();

        if (targetUserId) {
          console.log(targetUserId);
          client.to(targetUserId).emit('message', message);
        }
      }
    }

    // if (targetUserId) {
    //   client.to(targetUserId).emit('message', message);
    // }

    // if (targetUserId) {
    //   client.nsp.sockets.forEach((socket) => {
    //     const socketUserId = socket.handshake.user?._id?.toString();

    //     if (socketUserId && socketUserId === targetUserId) {
    //       socket.emit('message', message);
    //     }
    //   });
    // }
  }
}
