
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

import { Permis } from 'src/enums/permis.enum';
import { ProgressionType } from 'src/enums/progression-type.enum';

export class EnregistrerTentativeDto {

  @IsEnum(Permis)
  permis!: Permis;

  @IsEnum(ProgressionType)
  typeOfProgression!: ProgressionType;

  @IsString()
  @IsNotEmpty()
  elementId!: string;

  @IsBoolean()
  reussie!: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  score?: number;
}
