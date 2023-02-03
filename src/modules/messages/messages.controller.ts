import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RequestUser } from 'src/commons/decorators/request-user.decorator';

import { CurrentUser } from '../users/users.type';
import { FindManyMessagesDto } from './dto/find-many-messages.dto';
import { MessagesService } from './messages.service';

@Controller('messages')
@ApiTags('messages')
@ApiBearerAuth('JWT')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  private async findMany(
    @Query() findManyMessageDto: FindManyMessagesDto,
    @RequestUser() currentUser: CurrentUser,
  ) {
    return {
      type: 'messages',
      _conversationId: findManyMessageDto._conversationId,
      data: await this.messagesService.findMany(
        findManyMessageDto,
        currentUser,
      ),
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messagesService.findOne(+id);
  }
}
