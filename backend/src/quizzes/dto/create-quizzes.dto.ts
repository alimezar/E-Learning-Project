import { IsArray, IsMongoId, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateQuizDto {
  @IsMongoId()
  @IsNotEmpty()
  moduleId: string;

  @IsArray()
  @IsNotEmpty()
  questions: Types.ObjectId[];
}
