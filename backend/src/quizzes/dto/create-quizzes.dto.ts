import { IsArray, IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateQuizDto {
  @IsMongoId()
  @IsNotEmpty()
  moduleId: string;

  @IsArray()
  @IsNotEmpty()
  questions: Record<string, any>[];
}
