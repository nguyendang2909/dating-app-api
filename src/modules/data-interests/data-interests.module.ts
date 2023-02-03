import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AdminDataInterestsService } from './admin-data-interests.service';
import { DataInterestsController } from './data-interests.controller';
import { DataInterestsService } from './data-interests.service';
import {
  DataInterest,
  DataInterestSchema,
} from './entities/data-interest.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DataInterest.name, schema: DataInterestSchema },
    ]),
  ],
  controllers: [DataInterestsController],
  providers: [AdminDataInterestsService, DataInterestsService],
})
export class DataInterestsModule {}
