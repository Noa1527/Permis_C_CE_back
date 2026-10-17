import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendSignInWithEmailDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}