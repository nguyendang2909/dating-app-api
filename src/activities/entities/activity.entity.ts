import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { MongoLeanDocument } from 'src/commons/mongo-types.common';
import { BaseSchema } from 'src/commons/schemas.common';

@Schema({ timestamps: true })
export class Activity extends BaseSchema {
  @Prop({ type: String })
  method?: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  body?: unknown;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  params?: unknown;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  query?: unknown;

  @Prop({ type: String })
  path?: string;

  @Prop({ type: String })
  ip?: string;
}

export type ActivityDocument = MongoLeanDocument<Activity>;

export const activitySchema = SchemaFactory.createForClass(Activity);
