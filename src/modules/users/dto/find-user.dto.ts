import { Transform } from 'class-transformer';
import { IsArray, IsMongoId, IsOptional } from 'class-validator';

export class FindUserDto {
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  @Transform(({ value }) => {
    console.log("=======>", value)
    return value.split(',');
  })
  transformedValue: string[]; 

}