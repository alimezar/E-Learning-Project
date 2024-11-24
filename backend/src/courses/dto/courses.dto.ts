import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsEnum(['Beginner', 'Intermediate', 'Advanced'])
  difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced';

  @IsString()
  @IsNotEmpty()
  createdBy: string;
}
