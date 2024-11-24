import { IsArray, IsMongoId, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateResponseDto {
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsMongoId()
  @IsNotEmpty()
  quizId: string;

  @IsArray()
  @IsNotEmpty()
  answers: { questionId: string; answer: string }[];

  @IsOptional()
  @IsNumber()
  score?: number;
}
