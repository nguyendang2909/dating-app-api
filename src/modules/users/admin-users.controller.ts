import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ParamsWithId } from 'src/commons/dto/query-params.dto';

import { AdminUsersService } from './admin-users.service';
import { AdminCreateUserDto } from './dto/admin-create-user.dto';
import { AdminFindManyUsersDto } from './dto/admin-find-many-user.dto';
import { AdminFindOneUserByIdDto } from './dto/admin-find-one-user-by-id.dto';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';

@Controller('/admin/users')
@ApiTags('/admin/users')
@ApiBearerAuth('JWT')
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Post()
  private async createOneOrFail(
    @Body() adminCreateUserDto: AdminCreateUserDto,
  ) {
    const createResult = await this.adminUsersService.createOneOrFail(
      adminCreateUserDto,
    );

    return {
      type: 'createUser',
      data: createResult,
    };
  }

  @Get()
  private async findMany(
    @Query() adminFindManyUsersDto: AdminFindManyUsersDto,
  ) {
    const findResult = await this.adminUsersService.findMany(
      adminFindManyUsersDto,
    );

    return {
      type: 'users',
      data: findResult,
    };
  }

  @Get(':_id')
  private async findOneOrFailById(
    @Param() params: ParamsWithId,
    @Query() adminFindOneUserBydIdDto: AdminFindOneUserByIdDto,
  ) {
    const findResult = await this.adminUsersService.findOneOrFailById(
      params._id,
      adminFindOneUserBydIdDto,
    );
    return { type: 'user', data: findResult };
  }

  @Patch(':_id')
  private async update(
    @Param() params: ParamsWithId,
    @Body() adminUpdateUserDto: AdminUpdateUserDto,
  ) {
    return this.adminUsersService.updateOneOrFailById(
      params._id,
      adminUpdateUserDto,
    );
  }

  @Delete(':_id')
  private async remove(@Param() params: ParamsWithId) {
    await this.adminUsersService.remove(params._id);

    return;
  }
}
