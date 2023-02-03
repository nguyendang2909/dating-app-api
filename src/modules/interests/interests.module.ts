import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Interest, interestSchema } from './entities/interest.entity';
import { InterestsController } from './interests.controller';
import { InterestsService } from './interests.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Interest.name, schema: interestSchema },
    ]),
  ],
  controllers: [InterestsController],
  providers: [InterestsService],
})
export class InterestsModule {}
