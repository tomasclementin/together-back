import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export abstract class GameConfigDto {
  @ApiProperty({
    description: 'The id of the game config',
    example: 4,
    required: false,
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  id: number;

  @ApiProperty({
    description: 'The config type of the game',
    example: 'WhoIsConfig',
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  configType: string;

  @ApiProperty({
    description: 'The name of the game',
    example: 'Who is',
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  gameName: string;

  @ApiProperty({
    description: 'The title of the game',
    example: 'Who is...',
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  title: string;
}
