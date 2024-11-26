import { IsEmail, IsNotEmpty, IsString, IsEnum } from 'class-validator';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(['student', 'instructor', 'admin'])
  role: 'student' | 'instructor' | 'admin';
}

export default SignUpDto; 
