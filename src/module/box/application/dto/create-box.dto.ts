import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateBoxDto {
  @ApiProperty({
    description: 'The title of the box',
    example: 'Box title',
    required: true,
    type: String,
  })
  @Length(2, 25, { message: 'Box title length: 2 - 25 characters' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'The description of the box',
    example: 'Box description',
    required: true,
    type: String,
  })
  @Length(2, 100, { message: 'Box title length: 2 - 100 characters' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'The maximum number of players',
    example: 6,
    required: true,
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  maxPlayers: number;
}
