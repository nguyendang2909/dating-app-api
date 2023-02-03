import { IsOptional } from 'class-validator';
import { DtoFactory } from 'src/commons/lib/dto-factory.lib';

export class CreateActivity {
  @IsOptional()
  method: string;

  @IsOptional()
  body: unknown;

  @IsOptional()
  query: unknown;

  @IsOptional()
  path: string;

  @IsOptional()
  params: unknown;

  @IsOptional()
  ip: string;
}

export class CreateActivityDto extends DtoFactory.createOne(CreateActivity) {}
