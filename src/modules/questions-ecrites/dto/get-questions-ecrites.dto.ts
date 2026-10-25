
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { Permis } from 'src/enums/permis.enum';

export class GetQuestionsEcritesDto {
  @IsEnum(Permis)
  permis: Permis;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(20)
  fiche?: number;
}
