import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import _ from 'lodash';
import moment from 'moment';
import { Document, Model, PipelineStage, Types, UpdateQuery } from 'mongoose';
import { EntityFactory } from 'src/commons/lib/entity-factory.lib';

import { GalleryLeanDocument } from '../gallery/entities/gallery.entity';
import { EMediaType } from '../gallery/gallery.enum';
import { GalleryService } from '../gallery/gallery.service';
import { FindManyNearbyUsersDto } from './dto/find-many-nearby-users.dto';
import { FindOneUserByIdDto } from './dto/find-one-user-by-id.dto';
import { GetMyProfileDto } from './dto/get-my-profile.dto';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';
import { User, UserLeanDocument } from './entities/user.entity';
import { EGender, ELookingForGender } from './users.enum';
import { CurrentUser } from './users.type';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User & Document>,
    private readonly galleryService: GalleryService,
  ) {}

  public async findAll() {
    return `This action returns all users`;
  }

  public async findManyNearby(
    findManyNearbyUsersDto: FindManyNearbyUsersDto,
    currentUser: CurrentUser,
  ) {
    const {
      _id: _currentUserId,
      gender: currentGender,
      geolocation: currentGeolocation,
      lookingForGender: currentLookingForGender,
    } = currentUser;

    if (!currentGeolocation || !currentGender) {
      throw new BadRequestException();
    }

    const { _lastId, pageSize, fields } = findManyNearbyUsersDto;

    const findOptions: PipelineStage.Match['$match'] =
      EntityFactory.setFindOptions({
        _id: { $ne: _currentUserId },
        lookingForGender: { $in: [ELookingForGender.all, null, currentGender] },
      });

    const reverseGender =
      currentGender === EGender.male ? EGender.female : EGender.male;

    if (currentLookingForGender) {
      if (currentLookingForGender === ELookingForGender.all) {
        findOptions.gender = {
          $in: [ELookingForGender.male, ELookingForGender.female],
        };
      } else {
        findOptions.gender = currentLookingForGender;
      }
    } else {
      findOptions.gender = reverseGender;
    }

    const query = this.userModel
      .aggregate()
      .append({
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [
              currentGeolocation.coordinates[0],
              currentGeolocation.coordinates[1],
            ],
          },
          distanceField: 'distance',
          distanceMultiplier: 0.001,
        },
      })
      .lookup({
        from: 'gallery',
        as: 'avatar',
        let: {
          userId: '$_id',
        },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$_userId', '$$userId'] },
              isActive: true,
            },
          },
          {
            $limit: 1,
          },
        ],
      })
      .addFields({
        avatar: { $first: '$avatar' },
      })
      .match(findOptions);

    const findResult = await query.exec();

    const users = findResult.map((user) => this.parse(user));

    return users;
  }

  public async findOneById(
    _id: Types.ObjectId,
    findOneUserByIdDto: FindOneUserByIdDto,
  ): Promise<UserLeanDocument | null> {
    const { fields } = findOneUserByIdDto;

    const findOptions = EntityFactory.setFindOptions({ _id });

    let query = this.userModel.findOne(findOptions);

    if (fields) {
      query = query.select(fields);
    }

    const findResult = await query.lean().exec();

    return findResult;
  }

  public async findOneOrFailById(
    _id: Types.ObjectId,
    findOneUserByIdDto: FindOneUserByIdDto,
  ): Promise<UserLeanDocument> {
    const findResult = await this.findOneById(_id, findOneUserByIdDto);

    if (!findResult) {
      throw new NotFoundException({ type: 'user' });
    }

    return findResult;
  }

  public async getMyProfile(
    getMyProfileDto: GetMyProfileDto,
    currentUser: CurrentUser,
  ) {
    const { fields } = getMyProfileDto;

    const { _id: _currentUserId } = currentUser;

    const findResult = await this.userModel
      .findOne(EntityFactory.setFindOptions({ _id: currentUser._id }))
      .populate({
        path: 'avatar',
        match: EntityFactory.setFindOptions<GalleryLeanDocument>({
          _userId: _currentUserId,
          type: EMediaType.photo,
        }),
        select: ['_id', 'url'],
      })
      .populate({
        path: 'gallery',
        match: EntityFactory.setFindOptions<GalleryLeanDocument>({
          _userId: _currentUserId,
        }),
        select: ['_id', 'url'],
      })
      .populate({
        path: 'interests',
        select: ['tag', 'title'],
      })
      .select(fields)
      .lean()
      .exec();

    if (!findResult) {
      throw new NotFoundException();
    }

    const profile = this.parse(findResult);

    return profile;
  }

  public async updateMyProfile(
    updateMyProfileDto: UpdateMyProfileDto,
    currentUser: CurrentUser,
  ) {
    const { nickname, birthdate, longitude, latitude, ...updateDto } =
      updateMyProfileDto;

    const { _id: _currentUserId, haveBasicInfo: currentUserHaveBasicInfo } =
      currentUser;

    const findOptions = EntityFactory.setFindOptions<UserLeanDocument>({
      _id: _currentUserId,
    });

    const updateOptions: UpdateQuery<UserLeanDocument> = {
      ...updateDto,
      ...(longitude && latitude
        ? {
            geolocation: {
              type: 'Point',
              coordinates: [longitude, latitude],
            },
          }
        : {}),
    };

    if (birthdate) {
      const momentBirthdate = moment(birthdate, 'YYYY-MM-DD').utc(true);

      if (!moment.isMoment(momentBirthdate)) {
        throw new BadRequestException();
      }

      updateOptions.birthdate = momentBirthdate.toDate();
    }

    if (nickname) {
      if (currentUserHaveBasicInfo) {
        throw new BadRequestException();
      }

      updateOptions.nickname = nickname;
    }

    const updateResult = await this.userModel.updateOne(
      findOptions,
      updateOptions,
    );

    return EntityFactory.handleUpdateOne(updateResult);
  }

  private parse(user: UserLeanDocument) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userPart } = user;

    if (userPart.birthdate) {
      userPart.age = moment().diff(userPart.birthdate, 'years');
    }

    return userPart;
  }
}
