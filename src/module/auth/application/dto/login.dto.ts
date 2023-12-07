import { SignupDto } from './signup.dto';

import { PickType } from '@nestjs/swagger';

export class LoginDto extends PickType(SignupDto, [
  'email',
  'password',
] as const) {}
