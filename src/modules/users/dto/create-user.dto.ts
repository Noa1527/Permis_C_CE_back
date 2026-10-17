import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Role } from 'src/enums/role.enum';

export class CreateUserDto {
  @IsNotEmpty()
  password!: string;

  @IsString()
  @IsEnum(Object.values(Role))
  role!: Role;

  @IsNotEmpty()
  email!: string;

  @IsOptional()
  @IsBoolean()
  forcePasswordReset!: boolean;


}