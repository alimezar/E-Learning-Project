import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateNoteDto {
  @IsMongoId()
  @IsNotEmpty()
  user_id: string;

  @IsMongoId()
  @IsNotEmpty()
  course_id: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  created_at?: Date;

  @IsOptional()
  last_updated?: Date;
}
