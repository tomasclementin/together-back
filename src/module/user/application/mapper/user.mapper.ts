import { User } from '../../domain/user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';

import { Injectable } from '@nestjs/common';

@Injectable()
export class UserMapper {
  fromUpdateUserDtoToEntity(dto: UpdateUserDto): User {
    const userEntity = new User();
    userEntity.email = dto.email;
    userEntity.phoneNumber = dto.phoneNumber;
    userEntity.name = dto.name;
    userEntity.lastName = dto.lastName;
    return userEntity;
  }
}
