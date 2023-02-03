import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import _ from 'lodash';
import { RequestUser } from 'src/commons/decorators/request-user.decorator';
import { ParamsWithId } from 'src/commons/dto/query-params.dto';

import { FindManyNearbyUsersDto } from './dto/find-many-nearby-users.dto';
import { FindOneUserByIdDto } from './dto/find-one-user-by-id.dto';
import { GetMyProfileDto } from './dto/get-my-profile.dto';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';
import { UsersService } from './users.service';
import { CurrentUser } from './users.type';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth('JWT')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  private async findAll() {
    return this.usersService.findAll();
  }

  @Get('/nearby')
  private async findManyNearby(
    @Query() findManyNearbyUsersDto: FindManyNearbyUsersDto,
    @RequestUser() currentuser: CurrentUser,
  ) {
    return {
      type: 'nearbyUsers',
      data: await this.usersService.findManyNearby(
        findManyNearbyUsersDto,
        currentuser,
      ),
    };
  }

  @Get('my-profile')
  private async findMyProfile(
    @Query() getMyProfileDto: GetMyProfileDto,
    @RequestUser() currentUser: CurrentUser,
  ) {
    return {
      type: 'profile',
      data: await this.usersService.getMyProfile(getMyProfileDto, currentUser),
    };
  }

  @Get(':_id')
  private async findOne(
    @Param() params: ParamsWithId,
    @Query() findOneUserByIdDto: FindOneUserByIdDto,
  ) {
    const findResult = await this.usersService.findOneOrFailById(
      params._id,
      findOneUserByIdDto,
    );

    return {
      type: 'user',
      data: findResult,
    };
  }

  @Patch('my-profile')
  private async update(
    @Body() updateMyProfileDto: UpdateMyProfileDto,
    @RequestUser() currentUser: CurrentUser,
  ) {
    return {
      type: 'updateMyProfile',
      data: await this.usersService.updateMyProfile(
        updateMyProfileDto,
        currentUser,
      ),
    };
  }
}
