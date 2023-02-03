import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { EntityFactory } from 'src/commons/lib/entity-factory.lib';

import { ConversationsService } from '../conversations/conversations.service';
import { CurrentUser } from '../users/users.type';
import { CreateMessageDto } from './dto/create-message.dto';
import { FindManyMessagesDto } from './dto/find-many-messages.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<Message & Document>,
    private readonly conversationsService: ConversationsService,
  ) {}

  public async create(
    createMessageDto: CreateMessageDto,
    currentUser: CurrentUser,
  ) {
    const { _conversationId, text } = createMessageDto;

    const { _id: _currentUserId } = currentUser;

    await this.conversationsService.findOneOrFailById(
      _conversationId,
      _currentUserId,
    );

    const created = await this.messageModel.create<Message>({
      text,
      _conversationId,
      createdBy: _currentUserId,
      updatedBy: _currentUserId,
    });

    const conversationMessage = created.toJSON();

    return conversationMessage;
  }

  public async findMany(
    findManyMessageDto: FindManyMessagesDto,
    currentUser: CurrentUser,
  ) {
    const { _lastId, fields, pageSize, _conversationId, ...findDto } =
      findManyMessageDto;

    const { limit } = EntityFactory.getPagination({ pageSize });

    const { _id: _currentUserId } = currentUser;

    const conversation = await this.conversationsService.findOneOrFailSimple(
      { _id: _conversationId, fields: ['_id'] },
      currentUser,
    );

    const findOptions = EntityFactory.setFindOptions({
      ...findDto,
      ...(_lastId ? { _id: { $lt: _lastId } } : {}),
    });

    const findResult = await this.messageModel
      .find(findOptions)
      .sort({ _id: -1 })
      .limit(limit)
      .select(fields)
      .lean()
      .exec();

    return findResult;
  }

  public async findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  public async update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  public async remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
