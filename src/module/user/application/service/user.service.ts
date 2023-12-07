import { User } from '../../domain/user.entity';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../repository/user.repository.interface';

import { Inject, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY) private userRepository: IUserRepository,
  ) {}

  async getById(id: number): Promise<User> {
    const User = await this.userRepository.getUserBy({ id });

    if (!User) {
      throw new NotFoundException('User not found');
    }
    return User;
  }
}
