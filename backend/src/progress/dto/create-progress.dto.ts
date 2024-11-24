import { IsMongoId, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateProgressDto {
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsMongoId()
  @IsNotEmpty()
  courseId: string;

  @IsOptional()
  @IsNumber()
  completedPercentage?: number;

  @IsOptional()
  completedModules?: string[];

  @IsOptional()
  last_accessed?: Date;
}
