import { IsNotEmpty } from 'class-validator';
import { Role } from 'src/enums/role.enum';

export class SignInDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  email: string;

  role: Role;
}