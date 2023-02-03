import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ParamsWithId } from 'src/commons/dto/query-params.dto';

import { DataInterestsService } from './data-interests.service';

@Controller('data-interests')
@ApiTags('data-interests')
@ApiBearerAuth('JWT')
export class DataInterestsController {
  constructor(private readonly dataInterestsService: DataInterestsService) {}

  @Get()
  private async findAll() {
    return {
      type: 'dataInterests',
      data: await this.dataInterestsService.findAll({}),
    };
  }

  @Get(':_id')
  findOne(@Param() params: ParamsWithId) {
    return this.dataInterestsService.findOneById(params._id);
  }
}
