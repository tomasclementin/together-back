import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AccessTokenDto } from './aws-cognito.service.provider';

import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { ENVIRONMENTS } from '@root/ormconfig';

import {
  IUserQuery,
  USER_REPOSITORY,
} from '@/module/user/application/repository/user.repository.interface';
import { UserRepository } from '@/module/user/infrastructure/persistence/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
  ) {
    const options =
      process.env.NODE_ENV === ENVIRONMENTS.AUTOMATED_TEST
        ? {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: 'testsecret',
          }
        : {
            secretOrKeyProvider: passportJwtSecret({
              cache: true,
              rateLimit: true,
              jwksRequestsPerMinute: 5,
              jwksUri:
                `${process.env.COGNITO_ENDPOINT}/${process.env.COGNITO_USER_POOL_ID}` +
                '/.well-known/jwks.json',
            }),

            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            _audience: process.env.COGNITO_APP_CLIENT_ID,
            issuer: `${process.env.COGNITO_ENDPOINT}/${process.env.COGNITO_USER_POOL_ID}`,
            algorithms: ['RS256'],
          };

    super(options);
  }
  async validate(accessToken: AccessTokenDto) {
    const query: IUserQuery =
      process.env.NODE_ENV === ENVIRONMENTS.PRODUCTION
        ? { externalId: accessToken.username }
        : { email: accessToken.username };
    return await this.userRepository.getUserBy(query);
  }
}
