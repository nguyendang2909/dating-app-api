import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CreateInterestDto } from './dto/create-interest.dto';
import { UpdateInterestDto } from './dto/update-interest.dto';
import { InterestsService } from './interests.service';

@Controller('interests')
@ApiTags('interests')
@ApiBearerAuth('JWT')
export class InterestsController {
  constructor(private readonly interestsService: InterestsService) {}

  @Post()
  private async createOne(@Body() createInterestDto: CreateInterestDto) {
    const createResult = await this.interestsService.createOneOrFail(
      createInterestDto,
    );

    return {
      type: 'createInterest',
      daat: createResult,
    };
  }

  @Get()
  findAll() {
    // return this.interestsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.interestsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInterestDto: UpdateInterestDto,
  ) {
    return this.interestsService.update(+id, updateInterestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.interestsService.remove(+id);
  }
}
