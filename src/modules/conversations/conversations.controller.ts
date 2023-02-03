import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RequestUser } from 'src/commons/decorators/request-user.decorator';
import { ParamsWithId } from 'src/commons/dto/query-params.dto';
import { EntityFactory } from 'src/commons/lib/entity-factory.lib';

import { CurrentUser } from '../users/users.type';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { FindAllConversationsDto } from './dto/find-all-conversations.dto';
import { FindManyConversationsDto } from './dto/find-many-conversations.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';

@Controller('conversations')
@ApiTags('conversations')
@ApiBearerAuth('JWT')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Post()
  private async create(
    @Body() createConversationDto: CreateConversationDto,
    @RequestUser() currentuser: CurrentUser,
  ) {
    return {
      type: 'createConversation',
      data: await this.conversationsService.create(
        createConversationDto,
        currentuser,
      ),
    };
  }

  @Get()
  private async findMany(
    @Query() findManyConversationsDto: FindManyConversationsDto,
    @RequestUser() currentUser: CurrentUser,
  ) {
    return {
      type: 'conversations',
      data: await this.conversationsService.findMany(
        findManyConversationsDto,
        currentUser,
      ),
    };
  }

  @Get(':_id')
  private async findOne(
    @Param() params: ParamsWithId,
    @RequestUser() currentuser: CurrentUser,
  ) {
    return {
      type: 'conversation',
      data: await this.conversationsService.findOneOrFailById(
        params._id,
        currentuser,
      ),
    };
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateConversationDto: UpdateConversationDto,
  ) {
    return this.conversationsService.update(+id, updateConversationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.conversationsService.remove(+id);
  }
}
