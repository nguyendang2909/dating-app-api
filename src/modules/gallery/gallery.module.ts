import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Gallery, gallerySchema } from './entities/gallery.entity';
import { GalleryController } from './gallery.controller';
import { GalleryService } from './gallery.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Gallery.name, schema: gallerySchema, collection: 'gallery' },
    ]),
  ],
  exports: [GalleryService],
  controllers: [GalleryController],
  providers: [GalleryService],
})
export class GalleryModule {}
