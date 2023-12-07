import { UserMapper } from './application/mapper/user.mapper';
import { USER_REPOSITORY } from './application/repository/user.repository.interface';
import { UserService } from './application/service/user.service';
import { UserRepository } from './infrastructure/persistence/user.repository';
import { UserSchema } from './infrastructure/persistence/user.schema';
import { UserController } from './interface/user.controller';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserSchema])],
  providers: [
    UserMapper,
    UserRepository,
    UserService,
    { provide: USER_REPOSITORY, useClass: UserRepository },
  ],
  controllers: [UserController],
  exports: [UserService, UserRepository],
})
export class UserModule {}
