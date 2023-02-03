import { PartialType } from '@nestjs/swagger';

import { AdminCreateDataInterestDto } from './create-data-interest.dto';

export class AdminUpdateDataInterestDto extends PartialType(
  AdminCreateDataInterestDto,
) {}
