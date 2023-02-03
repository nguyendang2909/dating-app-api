import {
  BadRequestException,
  Logger,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import _ from 'lodash';
import { Server, Socket } from 'socket.io';
import { WsAuthGuard } from 'src/guards/ws-auth.guard';

import { AuthJwtService } from '../auth/auth-jwt.service';
import { AuthUsersService } from '../auth/auth-users.service';
import { ChatsService } from './chats.service';
import { JoinConversationDto } from './dto/join-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';

@WebSocketGateway({
  namespace: '/chats',
  cors: true,
  origin: '*',
})
export class ChatsGateway {
  constructor(
    private readonly chatsService: ChatsService,
    private readonly authJwtService: AuthJwtService,
    private readonly authUsersService: AuthUsersService,
  ) {}

  @WebSocketServer() private readonly server!: Server;

  private readonly logger = new Logger(ChatsGateway.name);

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('joinConversation')
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  )
  async joinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() joinConversationDto: JoinConversationDto,
  ) {
    try {
      await this.chatsService.joinConversation(joinConversationDto, client);
    } catch (err) {
      if (err instanceof Error) {
        client.emit('error', { message: err.message });
      } else {
        client.emit('error', {
          status: 403,
          type: 'joinConversation',
          message: "The conversation doesn't exist",
        });
      }
    }
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('sendMessage')
  async sendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() sendMessagesDto: SendMessageDto,
  ) {
    try {
      await this.chatsService.sendMessage(sendMessagesDto, client);
    } catch (err) {
      if (err instanceof Error) {
        client.emit('error', { message: err.message });
      } else {
        client.emit('error', { message: "The message hasn't been sent" });
      }
    }
  }

  private afterInit(server: Server) {
    server.use(async (client, next) => {
      try {
        const authHeaders =
          client.handshake.headers.authorization ||
          client.handshake.headers.Authorization;

        if (!authHeaders || !_.isString(authHeaders)) {
          return next(new Error('Unauthorized'));
        }

        const token = authHeaders.split(' ')[1];

        const decodedJwt = this.authJwtService.verify(token);

        const user = await this.authUsersService.findOneOrFailById(
          decodedJwt.id,
        );

        client.handshake.user = user;

        client.join(user._id.toString());

        next();
      } catch (err) {
        this.logger.log(`Client connected fail: ${client.id}`);

        return next(new Error('Unauthorized'));
      }
    });
  }

  private handleConnection(client: Socket) {
    this.logger.log(`Client connect: ${client.id}`);
  }

  private handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // @SubscribeMessage('createChat')
  // create(@MessageBody() createChatDto: CreateChatDto) {
  //   return this.chatsService.create(createChatDto);
  // }

  // @SubscribeMessage('findAllChats')
  // findAll() {
  //   return this.chatsService.findAll();
  // }

  // @SubscribeMessage('findOneChat')
  // findOne(@MessageBody() id: number) {
  //   return this.chatsService.findOne(id);
  // }

  // @SubscribeMessage('updateChat')
  // update(@MessageBody() updateChatDto: UpdateChatDto) {
  //   return this.chatsService.update(updateChatDto.id, updateChatDto);
  // }

  // @SubscribeMessage('removeChat')
  // remove(@MessageBody() id: number) {
  //   return this.chatsService.remove(id);
  // }
}
