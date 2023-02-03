import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import path from 'path';
import { APP_CONFIG } from 'src/app.config';
import { RequestUser } from 'src/commons/decorators/request-user.decorator';
import { ParamsWithId } from 'src/commons/dto/query-params.dto';
import { v4 as uuidv4 } from 'uuid';

import { CurrentUser } from '../users/users.type';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { FindManyMediaFilesDto } from './dto/find-many-media-files.dto';
import { FindMyPhotosDto } from './dto/find-my-media-files.dto';
import { GalleryService } from './gallery.service';

@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Post('/photos')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: APP_CONFIG.MAX_UPLOAD_PHOTO_FILE_SIZE,
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          req.fileValidationError = 'goes wrong on the mimetype';

          return cb(
            new BadRequestException('File không đúng định dạng ảnh'),
            false,
          );
        }

        file.filename = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, true);
      },
      // storage: diskStorage({
      //   destination: './temp',
      //   filename: (req, file, cb) => {
      //     const uniqueFilename = `${uuidv4()}${path.extname(
      //       file.originalname,
      //     )}`;

      //     cb(null, uniqueFilename);
      //   },
      // }),
    }),
  )
  private async createPhoto(
    @Body() createPhotoDto: CreatePhotoDto,
    @RequestUser() currentUser: CurrentUser,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException();
    }

    return {
      type: 'createPhoto',
      data: await this.galleryService.createPhoto(
        createPhotoDto,
        file,
        currentUser,
      ),
    };
  }

  @Get()
  private async findAll(
    @Query() findManyMediaFilesDto: FindManyMediaFilesDto,
    @RequestUser() currentUser: CurrentUser,
  ) {
    return {
      type: 'photos',
      data: await this.galleryService.findMany(
        findManyMediaFilesDto,
        currentUser,
      ),
    };
  }

  @Get('/my')
  private async findMy(
    @Query() findMyPhotosDto: FindMyPhotosDto,
    @RequestUser() currentUser: CurrentUser,
  ) {
    return {
      type: 'myPhotos',
      data: await this.galleryService.findMy(findMyPhotosDto, currentUser),
    };
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.photosService.findOne(+id);
  // }

  @Delete(':_id')
  private async remove(
    @Param() params: ParamsWithId,
    @RequestUser() currentUser: CurrentUser,
  ) {
    return {
      type: 'deletePhoto',
      data: await this.galleryService.remove(params._id, currentUser),
    };
  }
}
