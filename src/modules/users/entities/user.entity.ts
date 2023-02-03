import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import moment from 'moment';
import mongoose, { Types } from 'mongoose';
import {
  MongoGeoLocation,
  MongoLeanDocument,
} from 'src/commons/mongo-types.common';
import { BaseSchema } from 'src/commons/schemas.common';
import { DataInterest } from 'src/modules/data-interests/entities/data-interest.entity';
import { Gallery } from 'src/modules/gallery/entities/gallery.entity';

import {
  EDrinking,
  EEducationLevel,
  EGender,
  ELookingForGender,
  ELookingForRelationship,
  ERelationshipStatus,
  ERole,
  ESmoking,
  EUserStatus,
  EWorkout,
} from '../users.enum';

@Schema({ timestamps: true })
export class User extends BaseSchema {
  @Prop({
    required: false,
    ref: DataInterest.name,
    type: [mongoose.Schema.Types.ObjectId],
  })
  _interestIds: Types.ObjectId[];

  @Prop({ required: false, type: String })
  about?: string;

  age?: number;

  @Prop({ required: false, type: Date })
  birthdate?: string;

  @Prop({ type: String })
  company?: string;

  @Prop({ enum: EDrinking, type: String })
  drinking?: EDrinking;

  @Prop({ enum: EEducationLevel, required: false, type: String })
  educationLevel?: EEducationLevel;

  @Prop({ required: false, type: String })
  email?: string;

  @Prop({ required: false, type: String })
  isVerified?: boolean;

  @Prop({ requred: false, type: String })
  facebookId?: string;

  @Prop({ enum: EGender, required: false, type: String })
  gender?: EGender;

  @Prop({
    required: false,
    type: {
      enum: ['Point'],
      required: false,
      type: String,
    },
    coordinates: {
      required: false,
      type: [Number],
    },
  })
  geolocation?: MongoGeoLocation;

  @Prop({ type: String })
  jobTitle?: string;

  @Prop({ type: String })
  location?: string;

  @Prop({ enum: ELookingForGender, type: String })
  lookingForGender?: ELookingForGender;

  @Prop({ enum: ELookingForRelationship, type: String })
  lookingForRelationship?: ELookingForRelationship;

  @Prop({ required: false, type: Number })
  height?: number;

  @Prop({ required: false, type: String })
  hometown?: string;

  @Prop({ required: false, type: String, trim: true })
  nickname?: string;

  @Prop({ required: false, type: String })
  password?: string;

  @Prop({ required: false, type: String, trim: true })
  phoneNumber?: string;

  @Prop({ enum: ERelationshipStatus, type: String })
  relationshipStatus?: ERelationshipStatus;

  @Prop({ default: ERole.member, enum: ERole, required: true, type: String })
  role?: ERole;

  @Prop({ type: String })
  school?: string;

  @Prop({ enum: ESmoking, type: String })
  smoking?: ESmoking;

  @Prop({ required: false, type: String })
  status: EUserStatus;

  @Prop({ required: false, type: Number })
  telegramId?: number;

  @Prop({ type: Number })
  weight?: number;

  @Prop({ enum: EWorkout, type: String })
  workout?: EWorkout;

  avatar?: Gallery;
}

export type UserLeanDocument = MongoLeanDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ geolocation: '2dsphere' });

UserSchema.virtual('interests', {
  ref: DataInterest.name,
  localField: '_interestIds',
  foreignField: '_id',
  options: { sort: { title: 1 }, limit: 5 },
});

UserSchema.virtual('avatar', {
  ref: 'Gallery',
  localField: '_id',
  foreignField: '_userId',
  justOne: true,
});

UserSchema.virtual('gallery', {
  ref: 'Gallery',
  localField: '_id',
  foreignField: '_userId',
});

UserSchema.virtual('age').get(function () {
  if (this.birthdate) {
    return moment().diff(this.birthdate, 'years');
  }

  return undefined;
});

UserSchema.set('toObject', { virtuals: true });

UserSchema.set('toJSON', { virtuals: true });
