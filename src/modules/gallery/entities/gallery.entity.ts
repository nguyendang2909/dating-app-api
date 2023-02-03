import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { MongoLeanDocument } from 'src/commons/mongo-types.common';
import { BaseSchema } from 'src/commons/schemas.common';

import { EMediaType } from '../gallery.enum';

@Schema({ timestamps: true })
export class Gallery extends BaseSchema {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  _userId: Types.ObjectId;

  @Prop({ required: true, type: String })
  destination: string;

  @Prop({ enum: EMediaType, required: true, type: String })
  type: EMediaType;

  @Prop({ required: true, type: String })
  url: string;
}

export type GalleryLeanDocument = MongoLeanDocument<Gallery>;

export const gallerySchema = SchemaFactory.createForClass(Gallery);
