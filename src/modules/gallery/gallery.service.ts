import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { S3 } from 'aws-sdk';
import { Model, Types } from 'mongoose';
import sharp from 'sharp';
import { EntityFactory } from 'src/commons/lib/entity-factory.lib';

import { CurrentUser } from '../users/users.type';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { FindAllMediaFilesDto } from './dto/find-all-media-files.dto';
import { FindManyMediaFilesDto } from './dto/find-many-media-files.dto';
import { FindMyPhotosDto } from './dto/find-my-media-files.dto';
import { Gallery, GalleryLeanDocument } from './entities/gallery.entity';
import { EMediaType } from './gallery.enum';

@Injectable()
export class GalleryService {
  constructor(
    @InjectModel(Gallery.name)
    private readonly galleryModel: Model<Gallery & Document>,
  ) {}

  private readonly s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'ap-southeast-1',
  });

  public async createPhoto(
    createPhotoDto: CreatePhotoDto,
    file: Express.Multer.File,
    currentUser: CurrentUser,
  ) {
    const photo = await this.s3
      .upload({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `photos/${file.filename}`,
        Body: file.buffer,
        ACL: 'public-read',
      })
      .promise();

    const { _id: _currentUserId } = currentUser;

    const createOptions: Gallery = {
      _userId: _currentUserId,
      destination: photo.Key,
      type: EMediaType.photo,
      url: photo.Location,
      createdBy: _currentUserId,
      updatedBy: _currentUserId,
    };

    const createResult = await this.galleryModel.create(createOptions);

    return createResult.toJSON();
  }

  // findAll() {
  //   return `This action returns all photos`;
  // }

  public async findMany(
    findManyMediaFilesDto: FindManyMediaFilesDto,
    currentUser: CurrentUser,
  ) {
    const { fields, pageSize, ...findDto } = findManyMediaFilesDto;

    const { skip, limit } = EntityFactory.getPagination({ pageSize });

    const query = this.findAllQuery({ ...findDto }, currentUser);

    const findResult = await query.skip(skip).limit(limit).select(fields);

    return findResult;
  }

  public async findOneMy() {}

  public async findMy(
    findMyPhotosDto: FindMyPhotosDto,
    currentUser: CurrentUser,
  ) {
    const { fields } = findMyPhotosDto;

    const { limit } = EntityFactory.getPagination({});

    const { _id: _currentUserId } = currentUser;

    const findOptions = EntityFactory.setFindOptions<GalleryLeanDocument>({
      _userId: _currentUserId,
    });

    const findResult = await this.galleryModel
      .find(findOptions)
      .limit(limit)
      .select(fields)
      .lean()
      .exec();

    return findResult;
  }

  private findAllQuery(
    findAllMediaFilesDto: FindAllMediaFilesDto,
    currentUser: CurrentUser,
  ) {
    const { ...findDto } = findAllMediaFilesDto;

    const { _id: _currentUserId } = currentUser;

    const findOptions = EntityFactory.setFindOptions<GalleryLeanDocument>({
      ...findDto,
      _userId: _currentUserId,
    });

    const query = this.galleryModel.find(findOptions);

    return query;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} photo`;
  // }

  // public async findOneById(_id: Types.ObjectId, findOnePhotoDto: )

  public async remove(_id: Types.ObjectId, currentUser: CurrentUser) {
    const { _id: _currentUserId } = currentUser;

    const existPhoto = await this.galleryModel
      .findOne(EntityFactory.setFindOptions({ _id, _userId: _currentUserId }))
      .select('_id')
      .exec();

    if (!existPhoto) {
      throw new NotFoundException();
    }

    await existPhoto.updateOne({ isActive: false });

    return;
  }

  private async resize() {
    sharp();
  }
}
