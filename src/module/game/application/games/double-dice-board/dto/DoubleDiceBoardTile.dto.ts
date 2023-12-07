import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class DoubleDiceBoardTileDto {
  @IsNumber()
  @IsOptional()
  id?: number;
  @IsString()
  @IsNotEmpty()
  text: string;
}
