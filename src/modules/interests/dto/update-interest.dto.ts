import { PartialType } from '@nestjs/swagger';
import { DtoFactory } from 'src/commons/lib/dto-factory.lib';

import { CreateInterest, CreateInterestDto } from './create-interest.dto';

export class UpdateInterestDto extends DtoFactory.updateOne(CreateInterest) {}
