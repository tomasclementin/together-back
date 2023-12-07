import {
  AUTH_PROVIDER,
  IAuthProvider,
} from '../../infrastructure/services/authorization.provider.interface';
import { LoginDto } from '../dto/login.dto';
import { SignupDto } from '../dto/signup.dto';

import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  IUserRepository,
  USER_REPOSITORY,
} from '@/module/user/application/repository/user.repository.interface';
import { User } from '@/module/user/domain/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY) private userRepository: IUserRepository,
    @Inject(AUTH_PROVIDER)
    private authProvider: IAuthProvider,
  ) {}

  async signup(user: SignupDto) {
    const checkUser = await this.userRepository.getUserBy({
      email: user.email,
    });
    if (checkUser)
      throw new HttpException('User already exists.', HttpStatus.CONFLICT);

    const providerId = await this.authProvider.signup(user);
    const newUser = new User();
    newUser.name = user.name;
    newUser.lastName = user.lastName;
    newUser.phoneNumber = user.phoneNumber;
    newUser.email = user.email;
    newUser.externalId = providerId;
    return await this.userRepository.create(newUser);
  }

  async login(userDto: LoginDto) {
    const user = await this.userRepository.getUserBy({
      email: userDto.email,
    });
    if (!user) throw new NotFoundException('User does not exist.');
    return await this.authProvider.login(userDto);
  }
}
