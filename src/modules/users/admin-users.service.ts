import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import _ from 'lodash';
import { Document, FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { EntityFactory } from 'src/commons/lib/entity-factory.lib';

import { AdminCreateUserDto } from './dto/admin-create-user.dto';
import { AdminFindAllUsersDto } from './dto/admin-find-all-user.dto';
import { AdminFindManyUsersDto } from './dto/admin-find-many-user.dto';
import { AdminFindOneUserByIdDto } from './dto/admin-find-one-user-by-id.dto';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';
import { User, UserLeanDocument } from './entities/user.entity';

@Injectable()
export class AdminUsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User & Document>,
  ) {}

  createOneOrFail(adminCreateUserDto: AdminCreateUserDto) {
    return 'This action adds a new user';
  }

  public async findMany(
    adminFindManyUsersDto: AdminFindManyUsersDto,
  ): Promise<UserLeanDocument[]> {
    const { page, pageSize, ...findDto } = adminFindManyUsersDto;

    const { skip, limit } = EntityFactory.getPagination({ page, pageSize });

    const query = this.findAllQuery(findDto);

    const findResult = await query.skip(skip).limit(limit);

    return findResult;
  }

  private findAllQuery(adminFindAllUsersDto: AdminFindAllUsersDto) {
    const { fields, email, ...findDto } = adminFindAllUsersDto;

    const findOptions: FilterQuery<UserLeanDocument> = { ...findDto };

    if (email) {
      findOptions.email = new RegExp(email, 'i');
    }

    const query = this.userModel.find(findOptions).select(fields);

    return query;
  }

  public async findOneById(
    _id: Types.ObjectId,
    findOneUserByIdDto: AdminFindOneUserByIdDto,
  ): Promise<UserLeanDocument | null> {
    const { fields, ...findDto } = findOneUserByIdDto;

    const findOptions: FilterQuery<UserLeanDocument> = { ...findDto, _id };

    const findResult = this.userModel
      .findOne(findOptions)
      .select(fields)
      .exec();

    return findResult;
  }

  public async findOneOrFailById(
    _id: Types.ObjectId,
    findOneUserByIdDto: AdminFindOneUserByIdDto,
  ): Promise<UserLeanDocument> {
    const findResult = await this.findOneById(_id, findOneUserByIdDto);

    if (!findResult) {
      throw new NotFoundException();
    }

    return findResult;
  }

  public async updateOneOrFailById(
    _id: Types.ObjectId,
    adminUpdateUserDto: AdminUpdateUserDto,
  ) {
    const { ...updateDto } = adminUpdateUserDto;

    const findOptions: FilterQuery<UserLeanDocument> = {
      _id,
    };

    const updateOptions: UpdateQuery<UserLeanDocument> = { ...updateDto };

    const updateResult = await this.userModel.updateOne(
      findOptions,
      updateOptions,
    );

    EntityFactory.handleUpdateOne(updateResult);

    return;
  }

  public async remove(_id: Types.ObjectId) {
    const removeResult = await this.userModel.updateOne(
      { isActive: true, _id },
      {
        isActive: false,
      },
    );

    EntityFactory.handleDeleteOne(removeResult);

    return;
  }
}
