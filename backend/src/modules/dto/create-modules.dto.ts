import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateModuleDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;
  
  @IsOptional()
  resources?: string[];

  @IsMongoId()
  @IsNotEmpty()
  courseId: string;
}
