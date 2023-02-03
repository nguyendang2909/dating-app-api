import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import _ from 'lodash';
import { Model, Types } from 'mongoose';
import { EntityFactory } from 'src/commons/lib/entity-factory.lib';

import { FindAllDataInterestDto } from './dto/find-all-data-interest.dto';
import { FindOneDataInterestDto } from './dto/find-one-data-interest.dto';
import {
  DataInterest,
  DataInterestDocument,
} from './entities/data-interest.entity';

@Injectable()
export class DataInterestsService {
  constructor(
    @InjectModel(DataInterest.name)
    private readonly dataInterestModel: Model<DataInterest>,
  ) {}

  logger = new Logger(DataInterestsService.name);

  public async findAll(findAllDataInterestDto: FindAllDataInterestDto) {
    const found = await this.findAllQuery(findAllDataInterestDto).lean().exec();

    return found;
  }

  public async findOne(findOneDataInterest: FindOneDataInterestDto) {
    const { ...findDto } = findOneDataInterest;

    if (_.isEmpty(findDto)) {
      return null;
    }

    const findOptions = EntityFactory.setFindOptions<DataInterestDocument>({
      ...findDto,
    });

    const found = await this.dataInterestModel
      .findOne(findOptions)
      .lean()
      .exec();

    return found;
  }

  public async findOneById(
    _id: Types.ObjectId,
  ): Promise<DataInterestDocument | null> {
    const findOptions = EntityFactory.setFindOptions<DataInterest>({ _id });

    const document = await this.dataInterestModel
      .findOne(findOptions)
      .lean()
      .exec();

    return document;
  }

  public async findOneByIdOrFail(
    _id: Types.ObjectId,
  ): Promise<DataInterestDocument> {
    const document = await this.findOneById(_id);

    if (!document) {
      throw new NotFoundException();
    }

    return document;
  }

  private findAllQuery(findAllDataInterestDto: FindAllDataInterestDto) {
    const { ...findDto } = findAllDataInterestDto;

    const findOptions = EntityFactory.setFindOptions<DataInterestDocument>({
      ...findDto,
    });

    const query = this.dataInterestModel.find(findOptions);

    return query;
  }
}
