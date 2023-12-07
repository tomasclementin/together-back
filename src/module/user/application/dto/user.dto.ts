import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    description: 'The id of the user',
    example: 1,
    required: true,
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty({
    description: 'The email of the user',
    example: 'user@email.com',
    required: true,
    type: String,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'The phone number of the user',
    example: '9999999999',
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The lastname of the user',
    example: 'Doe',
    required: true,
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;
}
