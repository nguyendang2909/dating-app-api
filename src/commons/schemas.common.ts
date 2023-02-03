import { Prop, Schema } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class CommonSchema {
  createdAt?: Date;

  updatedAt?: Date;

  @Prop({ required: true, type: Boolean, default: true })
  isActive?: boolean;
}

@Schema({ timestamps: true })
export class BaseSchema extends CommonSchema {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  updatedBy: Types.ObjectId;
}

export type BaseDocument = BaseSchema & Document;
