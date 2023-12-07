import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'user@email.com',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The phone number of the user',
    example: '9999999999',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    description: 'The name of the user',
    example: 'username',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The lastname of the user',
    example: 'userlastname',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  /* Minimum eight characters, at least one uppercase letter, one lowercase letter, one number, and one special character */
  @ApiProperty({
    description: 'The password of the user',
    example: 'Password1.',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$&+,:;=?@#|'<>.^*()%!-])[A-Za-z\d@$&+,:;=?@#|'<>.^*()%!-]{8,}$/,
    { message: 'invalid password format' },
  )
  password: string;
}
