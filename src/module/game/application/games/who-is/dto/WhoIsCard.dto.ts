import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class WhoIsCardDto {
  @IsNumber()
  @IsOptional()
  id?: number;
  @IsString()
  @IsNotEmpty()
  text: string;
}
