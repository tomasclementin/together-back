import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class AddGameToBoxDto {
  @ApiProperty({
    description: 'The id of the game config',
    example: 4,
    required: true,
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  configId: number;

  @ApiProperty({
    description: 'The order of the phase',
    example: 2,
    required: true,
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  phaseOrder: number;

  @ApiProperty({
    description: 'The name of the phase',
    example: 'Connect',
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  phaseName: string;
}
