import { IsEmail, IsNotEmpty, IsString, IsEnum, MinLength } from 'class-validator';

export class SignUpDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsEnum(['student', 'instructor', 'admin'])
  role: 'student' | 'instructor' | 'admin';
}

export default SignUpDto; 
