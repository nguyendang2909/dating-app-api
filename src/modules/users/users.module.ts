import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { GalleryModule } from '../gallery/gallery.module';
import { AdminUsersController } from './admin-users.controller';
import { AdminUsersService } from './admin-users.service';
import { User, UserSchema } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    GalleryModule,
  ],
  exports: [UsersService],
  controllers: [AdminUsersController, UsersController],
  providers: [AdminUsersService, UsersService],
})
export class UsersModule {}
