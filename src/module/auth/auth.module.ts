import { USER_REPOSITORY } from '../user/application/repository/user.repository.interface';
import { UserRepository } from '../user/infrastructure/persistence/user.repository';
import { UserModule } from '../user/user.module';
import { AuthService } from './application/service/auth.service';
import { AUTH_PROVIDER } from './infrastructure/services/authorization.provider.interface';
import { AwsCognitoServiceProvider } from './infrastructure/services/aws-cognito.service.provider';
import { JwtStrategy } from './infrastructure/services/jwt.strategy';
import { AuthController } from './interface/auth.controller';

import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [UserModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [
    AuthService,
    {
      provide: AUTH_PROVIDER,
      useClass: AwsCognitoServiceProvider,
    },
    JwtStrategy,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],
  controllers: [AuthController],
  exports: [
    {
      provide: AUTH_PROVIDER,
      useClass: AwsCognitoServiceProvider,
    },
  ],
})
export class AuthModule {}
