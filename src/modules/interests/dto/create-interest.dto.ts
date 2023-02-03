import { Transform } from 'class-transformer';
import { IsNotEmpty, Length } from 'class-validator';
import { Types } from 'mongoose';
import { DtoFactory } from 'src/commons/lib/dto-factory.lib';

export class CreateInterest {
  @IsNotEmpty()
  @Transform(({ value }: { value: string[] }) =>
    value.map((item) => new Types.ObjectId(item)),
  )
  @Length(3, 50)
  dataInterestIds: Types.ObjectId[];
}

export class CreateInterestDto extends DtoFactory.createOne(CreateInterest) {}
