import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import _ from 'lodash';
import mongoose, { Document, Model } from 'mongoose';
import { EntityFactory } from 'src/commons/lib/entity-factory.lib';

import { UsersService } from '../users/users.service';
import { CurrentUser } from '../users/users.type';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { FindManyConversationsDto } from './dto/find-many-conversations.dto';
import { FindOneConversationDto } from './dto/find-one-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import {
  Conversation,
  ConversationLeanDocument,
} from './entities/conversation.entity';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<
      Conversation & Document<mongoose.Types.ObjectId>
    >,
    private readonly usersService: UsersService,
  ) {}

  private readonly logger = new Logger(ConversationsService.name);

  public async create(
    createConversationDto: CreateConversationDto,
    currentUser: CurrentUser,
  ) {
    const { _targetUserId, ...createDto } = createConversationDto;

    const { _id: _currentUserId } = currentUser;

    if (_targetUserId.toString() === _currentUserId.toString()) {
      throw new BadRequestException();
    }

    const targetUser = await this.usersService.findOneOrFailById(
      _targetUserId,
      { fields: ['_id'] },
    );

    const _userIds = [_currentUserId, _targetUserId];

    const createConversation =
      await this.conversationModel.create<Conversation>({
        _userIds,
        ...createDto,
      });

    return createConversation.toJSON();
  }

  // public async findMany(
  //   findManyConversationsDto: FindManyConversationsDto,
  //   currentUser: CurrentUser,
  // ) {
  //   const { _lastId, fields, pageSize, ...findDto } = findManyConversationsDto;

  //   const { limit } = EntityFactory.getPagination({ pageSize });

  //   const findOptions = EntityFactory.setFindOptions<ConversationLeanDocument>({
  //     ...findDto,
  //   });

  //   if (_lastId) {
  //     findOptions._id = { $gt: _lastId };
  //   }

  //   const _currentUserId = currentUser._id;

  //   const query = this.conversationModel
  //     .find(findOptions)
  //     .populate({
  //       path: 'targetMember',
  //       match: EntityFactory.setFindOptions({
  //         _userId: { $ne: _currentUserId },
  //       }),
  //       select: ['_id', '_userId'],
  //       populate: {
  //         path: 'user',
  //         match: EntityFactory.setFindOptions(),
  //         select: ['_id', 'nickname'],
  //         populate: {
  //           path: 'avatar',
  //           match: EntityFactory.setFindOptions(),
  //           select: ['url'],
  //         },
  //       },
  //     })
  //     .populate({
  //       path: 'lastMessage',
  //       match: EntityFactory.setFindOptions(),
  //     });

  //   const findResult = await query
  //     .limit(limit)
  //     .sort({
  //       _id: -1,
  //     })
  //     .select(fields)
  //     .lean()
  //     .exec();

  //   console.log(findResult);

  //   return findResult;
  // }

  public async findMany(
    findManyConversationsDto: FindManyConversationsDto,
    currentUser: CurrentUser,
  ) {
    const { _lastId, fields, pageSize, ...findDto } = findManyConversationsDto;

    // const lastId = new mongoose.Types.ObjectId('63b11f74656431812142b5fc');

    const { limit } = EntityFactory.getPagination({ pageSize });

    const _currentUserId = currentUser._id;

    const findOptions = EntityFactory.setFindOptions({
      ...(_lastId ? { _id: { $lt: _lastId } } : {}),
    });

    const findResult = await this.conversationModel
      .find(findOptions)
      .populate({
        path: 'members',
        match: {
          _id: { $ne: _currentUserId },
        },
        select: ['nickname'],
        populate: {
          path: 'avatar',
          select: ['url'],
        },
      })
      .populate({
        path: 'lastMessage',
        select: [
          '_id',
          'text',
          '_conversationId',
          'createdAt',
          'updatedAt',
          'createdBy',
        ],
      })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .select(['_userIds', ...fields])
      .lean()
      .exec();

    return findResult;
  }

  public async findOneById(
    _id: mongoose.Types.ObjectId,
    currentUser: CurrentUser,
  ) {
    const { _id: _currentUserId } = currentUser;

    const findOptions = EntityFactory.setFindOptions<ConversationLeanDocument>({
      _id,
      _userIds: _currentUserId,
    });

    const conversation = await this.conversationModel
      .findOne(findOptions)
      .populate({
        path: 'members',
        match: {
          _id: { $ne: _currentUserId },
        },
        select: ['nickname'],
        populate: {
          path: 'avatar',
          select: ['url'],
        },
      })
      .lean()
      .exec();

    return conversation;
  }

  public async findOneOrFailById(
    _id: mongoose.Types.ObjectId,
    currentUser: CurrentUser,
  ) {
    const { _id: _currentUserId } = currentUser;

    const conversation = await this.findOneById(_id, _currentUserId);

    if (!conversation) {
      throw new NotFoundException({ type: 'conversation' });
    }

    return conversation;
  }

  public async findOne(
    findOneConversationDto: FindOneConversationDto,
    _currentUserId: mongoose.Types.ObjectId,
  ) {
    const { fields, ...findDto } = findOneConversationDto;

    if (_.isEmpty(findDto)) {
      return null;
    }

    const { _id, _userId } = findDto;

    const findOptions = EntityFactory.setFindOptions<Conversation>();

    if (_id) {
      findOptions._id = _id;

      findOptions._userIds = _currentUserId;
    }

    if (_userId) {
      findOptions._userIds = { $all: [_currentUserId, _userId] };
    }

    const query = this.conversationModel.findOne(findOptions);

    const findResult = await query
      .populate({
        path: 'members',
        match: {
          _id: { $ne: _currentUserId },
        },
        select: ['nickname'],
        populate: {
          path: 'avatar',
          select: ['url'],
        },
      })
      .select(fields)
      .lean()
      .exec();

    return findResult;
  }

  public async findOneSimple(
    findOneConversationDto: FindOneConversationDto,
    currentUser: CurrentUser,
  ) {
    const { _id: _currentUserId } = currentUser;

    const { fields, ...findDto } = findOneConversationDto;

    if (_.isEmpty(findDto)) {
      return null;
    }

    const { _id, _userId } = findDto;

    const findOptions = EntityFactory.setFindOptions<Conversation>();

    if (_id) {
      findOptions._id = _id;

      findOptions._userIds = _currentUserId;
    }

    if (_userId) {
      findOptions._userIds = { $all: [_currentUserId, _userId] };
    }

    const query = this.conversationModel.findOne(findOptions);

    const findResult = await query.select(fields).lean().exec();

    return findResult;
  }

  public async findOneOrFailSimple(
    findOneConversationDto: FindOneConversationDto,
    currentUser: CurrentUser,
  ) {
    const conversation = await this.findOneSimple(
      findOneConversationDto,
      currentUser,
    );

    if (!conversation) {
      throw new NotFoundException({ type: 'conversation' });
    }

    return conversation;
  }

  update(id: number, updateConversationDto: UpdateConversationDto) {
    return `This action updates a #${id} conversation`;
  }

  remove(id: number) {
    return `This action removes a #${id} conversation`;
  }
}
