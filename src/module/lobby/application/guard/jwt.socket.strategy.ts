import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { ENVIRONMENTS } from '@root/ormconfig';

import { AccessTokenDto } from '@/module/auth/infrastructure/services/aws-cognito.service.provider';
import { IUserQuery } from '@/module/user/application/repository/user.repository.interface';
import { UserRepository } from '@/module/user/infrastructure/persistence/user.repository';

@Injectable()
export class JwtSocketStrategy extends PassportStrategy(
  Strategy,
  'WebSocketJwt',
) {
  constructor(
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
  ) {
    const options =
      process.env.NODE_ENV === ENVIRONMENTS.AUTOMATED_TEST
        ? {
            jwtFromRequest: ExtractJwt.fromUrlQueryParameter('authorization'),
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

            jwtFromRequest: ExtractJwt.fromUrlQueryParameter('authorization'),
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
