import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Types } from 'mongoose';
import { UpdateOneDto } from 'src/commons/dto/update-one.dto';

import {
  EDrinking,
  EEducationLevel,
  EGender,
  ELookingForGender,
  ELookingForRelationship,
  ERelationshipStatus,
  ESmoking,
  EWorkout,
} from '../users.enum';

export class UpdateMyProfileDto extends UpdateOneDto {
  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @Transform(({ value }: { value: string[] }) =>
    value.map((item) => new Types.ObjectId(item)),
  )
  _interestIds: Types.ObjectId[];

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  about?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  @MaxLength(130)
  company?: string;

  @ApiPropertyOptional({ type: String, enum: EDrinking })
  @IsOptional()
  @IsEnum(EDrinking)
  drinking?: EDrinking;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  nickname?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsDateString()
  birthdate?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  location?: string;

  @ApiPropertyOptional({ enum: EEducationLevel, type: String })
  @IsOptional()
  @IsEnum(EEducationLevel)
  educationLevel?: EEducationLevel;

  @ApiPropertyOptional({ type: String, enum: EGender, default: EGender.male })
  @IsOptional()
  @IsEnum(EGender)
  gender?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  @MaxLength(130)
  jobTitle?: string;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiPropertyOptional({ type: String, enum: ELookingForRelationship })
  @IsOptional()
  @IsEnum(ELookingForRelationship)
  lookingForRelationship?: ELookingForRelationship;

  @ApiPropertyOptional({ type: String, enum: ELookingForGender })
  @IsOptional()
  @IsEnum(ELookingForGender)
  lookingForGender?: ELookingForGender[];

  @ApiPropertyOptional({ type: String, enum: ERelationshipStatus })
  @IsOptional()
  @IsEnum(ERelationshipStatus)
  relationshipStatus?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  @MaxLength(130)
  school?: string;

  @ApiPropertyOptional({ type: String, enum: ESmoking })
  @IsOptional()
  @IsEnum(ESmoking)
  smoking?: ESmoking;

  @ApiPropertyOptional({ type: String, enum: EWorkout })
  @IsOptional()
  @IsEnum(EWorkout)
  workout?: EWorkout;
}
