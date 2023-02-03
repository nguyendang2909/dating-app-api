import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';

import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { Activity } from './entities/activity.entity';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectModel(Activity.name)
    private readonly activityModel: Model<Activity & Document>,
  ) {}

  public async create(createActivityDto: CreateActivityDto) {
    const { ...createDto } = createActivityDto;

    const createOptions: Activity = {
      ...createDto,
    };

    return await this.activityModel.create(createOptions);
  }

  // findAll() {
  //   return `This action returns all activities`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} activity`;
  // }

  // update(id: number, updateActivityDto: UpdateActivityDto) {
  //   return `This action updates a #${id} activity`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} activity`;
  // }
}
