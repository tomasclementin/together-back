import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreatePhaseDto {
  @ApiProperty({
    description: 'The order of the phase',
    example: 2,
    required: true,
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  order: number;

  @ApiProperty({
    description: 'The name of the phase',
    example: 'Connect',
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 25, { message: 'Phase name length: 2 - 25 characters' })
  name: string;
}
