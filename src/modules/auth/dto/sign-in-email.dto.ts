import { IsNotEmpty } from 'class-validator';

export class SignInWithEmailDto {
  @IsNotEmpty()
  token: string;
}