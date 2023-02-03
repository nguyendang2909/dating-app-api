import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MongoLeanDocument } from 'src/commons/mongo-types.common';

@Schema({ timestamps: true })
export class DataInterest {
  @Prop({ required: true, type: String })
  tag?: string;

  @Prop({ required: true, type: String })
  title?: string;
}

export type DataInterestDocument = MongoLeanDocument<DataInterest>;

export const DataInterestSchema = SchemaFactory.createForClass(DataInterest);
