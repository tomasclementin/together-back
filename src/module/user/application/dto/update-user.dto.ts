import { UserDto } from './user.dto';

import { PartialType } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(UserDto) {}
