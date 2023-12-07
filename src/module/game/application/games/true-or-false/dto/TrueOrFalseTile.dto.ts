import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class TrueOrFalseTileDto {
  @IsNumber()
  @IsOptional()
  id?: number;
  @IsString()
  @IsNotEmpty()
  text: string;
}
