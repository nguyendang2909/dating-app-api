import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import _ from 'lodash';
import {
  FilterQuery,
  Model,
  ObjectId,
  Types,
  UpdateQuery,
  UpdateWriteOpResult,
} from 'mongoose';
import { EntityFactory } from 'src/commons/lib/entity-factory.lib';

import { dataInterestsInitData } from './app-interests.init-data';
import { AdminUpdateDataInterestDto } from './dto/admin-update-data-interest.dto';
import { AdminCreateDataInterest } from './dto/create-data-interest.dto';
import { FindAllDataInterestDto } from './dto/find-all-data-interest.dto';
import { FindOneDataInterestDto } from './dto/find-one-data-interest.dto';
import {
  DataInterest,
  DataInterestDocument,
} from './entities/data-interest.entity';

@Injectable()
export class AdminDataInterestsService {
  constructor(
    @InjectModel(DataInterest.name)
    private readonly dataInterestModel: Model<DataInterest>,
  ) {}

  logger = new Logger(AdminDataInterestsService.name);

  async onApplicationBootstrap() {
    try {
      for (const dataInterest of dataInterestsInitData) {
        try {
          const { tag, title } = dataInterest;

          const existDataInterest = await this.findOne({ tag });

          if (
            existDataInterest &&
            existDataInterest.tag === tag &&
            existDataInterest.title === title
          ) {
            return;
          }

          await this.createOneOrFail(dataInterest);
        } catch (err) {
          this.logger.error(err);
        }
      }
    } catch (err) {}
  }

  public async createOneOrFail(createDataInterestDto: AdminCreateDataInterest) {
    const { tag, title } = createDataInterestDto;

    const createResult = await this.dataInterestModel.create({
      tag,
      title,
    });

    if (!createResult) {
      throw new InternalServerErrorException();
    }

    return createResult;
  }

  public async findAll(findAllDataInterestDto: FindAllDataInterestDto) {
    const found = await this.findAllQuery(findAllDataInterestDto);

    return found;
  }

  public async findOne(findOneDataInterest: FindOneDataInterestDto) {
    const { ...findDto } = findOneDataInterest;

    if (_.isEmpty(findDto)) {
      return null;
    }

    const findOptions: FilterQuery<DataInterestDocument> = {
      ...findDto,
    };

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

  public async updateOneOrFail(
    _id: ObjectId,
    updateInterestDto: AdminUpdateDataInterestDto,
  ) {
    const { ...updateDto } = updateInterestDto;

    const findOptions: FilterQuery<DataInterestDocument> = { _id };

    const updateOptions: UpdateQuery<DataInterestDocument> = { ...updateDto };

    const updateResult: UpdateWriteOpResult = await this.dataInterestModel
      .updateOne(findOptions, updateOptions)
      .exec();

    const result = EntityFactory.handleUpdateOne(updateResult);

    return result;
  }

  private findAllQuery(findAllDataInterestDto: FindAllDataInterestDto) {
    const { ...findDto } = findAllDataInterestDto;

    const findOptions: FilterQuery<DataInterestDocument> = {
      ...findDto,
    };

    const query = this.dataInterestModel.find(findOptions);

    return query;
  }
}
