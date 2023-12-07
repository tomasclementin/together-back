import { IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class NewGuestDto {
  @ApiProperty({
    description: 'The name of the guest',
    example: 'Guest name',
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The pin of the lobby',
    example: '1234',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  pin: string;
}
