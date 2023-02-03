import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ActivitiesService } from './activities.service';
import { Activity, activitySchema } from './entities/activity.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Activity.name, schema: activitySchema },
    ]),
  ],
  exports: [ActivitiesService],
  providers: [ActivitiesService],
})
export class ActivitiesModule {}
