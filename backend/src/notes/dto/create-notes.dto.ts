import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNotesDto {
  @IsString()
  @IsNotEmpty()
  content: string;  // Only `content` is required to create a note
}
