import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { MongoLeanDocument } from 'src/commons/mongo-types.common';
import { DataInterestDocument } from 'src/modules/data-interests/entities/data-interest.entity';

@Schema({ timestamps: true })
export class Interest {
  @Prop({ required: true, type: [mongoose.Schema.Types.ObjectId] })
  dataInterestId: Types.ObjectId[];
}

export type InterestDocument = MongoLeanDocument<Interest> & {
  dataInterests?: DataInterestDocument[];
};

export const interestSchema = SchemaFactory.createForClass(Interest);
