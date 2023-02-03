import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { FindAllDataInterestDto } from '../data-interests/dto/find-all-data-interest.dto';
import { CreateInterestDto } from './dto/create-interest.dto';
import { FindAllInterestDto } from './dto/find-all-interest.dto';
import { FindManyInterestsDto } from './dto/find-many-interest.dto';
import { UpdateInterestDto } from './dto/update-interest.dto';
import { Interest, InterestDocument } from './entities/interest.entity';

@Injectable()
export class InterestsService {
  constructor(
    @InjectModel(Interest.name)
    private readonly interestModel: Model<Interest & Document>,
  ) {}

  public async createOneOrFail(createInterestDto: CreateInterestDto) {
    const { ...createDto } = createInterestDto;

    const createOptions = { ...createDto, userId: Types.ObjectId };

    const createResult = await this.interestModel.create(createOptions);

    const createDocument = createResult.toJSON();

    return createDocument;
  }

  public async findMany(findManyInterestDto: FindManyInterestsDto) {
    const { fields, ...findDto } = findManyInterestDto;
  }

  public async findAllQuery(findAllInterestDto: FindAllInterestDto) {}

  findOne(id: number) {
    return `This action returns a #${id} interest`;
  }

  update(id: number, updateInterestDto: UpdateInterestDto) {
    return `This action updates a #${id} interest`;
  }

  remove(id: number) {
    return `This action removes a #${id} interest`;
  }
}
