import { CognitoUserSession } from 'amazon-cognito-identity-js';
import { join } from 'path';
import * as request from 'supertest';

import { LoginDto } from '../../application/dto/login.dto';
import { SignupDto } from '../../application/dto/signup.dto';
import {
  AUTH_PROVIDER,
  IAuthProvider,
} from '../../infrastructure/services/authorization.provider.interface';

import {
  HttpStatus,
  INestApplication,
  NotFoundException,
  ValidationPipe,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { loadFixtures } from '@data/fixture/util/loader';

import { AppModule } from '@/module/app.module';

describe('/POST AuthController', () => {
  let app: INestApplication;
  let authProvider: IAuthProvider;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    await loadFixtures(
      `${__dirname}/fixture`,
      join(__dirname, '..', '..', '..', '..', '..', 'ormconfig.ts'),
    );

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(new ValidationPipe());

    await app.init();

    authProvider = app.get<IAuthProvider>(AUTH_PROVIDER);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('POST /signup', () => {
    it('Should sign up a new user', () => {
      authProvider.signup = jest.fn();
      jest.spyOn(authProvider, 'signup').mockResolvedValue('external_id_test');
      const postBody: SignupDto = {
        email: 'newUserEmail@email.com',
        phoneNumber: '123456789',
        name: 'test_name',
        lastName: 'test_lastname',
        password: 'Password1.',
      };
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send(postBody)
        .expect(HttpStatus.CREATED)
        .then((res) =>
          expect(res.body).toHaveProperty('email', postBody.email),
        );
    });

    it('Should sign up an existing user', () => {
      authProvider.signup = jest.fn();
      jest.spyOn(authProvider, 'signup').mockResolvedValue('external_id_test');
      const postBody: SignupDto = {
        email: 'test@email.com',
        phoneNumber: '123456789',
        name: 'test_name',
        lastName: 'test_lastname',
        password: 'Password1.',
      };
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send(postBody)
        .expect(HttpStatus.CONFLICT);
    });

    it('Should try to sign up with invalid information', () => {
      authProvider.signup = jest.fn();
      jest.spyOn(authProvider, 'signup').mockResolvedValue('external_id_test');
      const postBody: SignupDto = {
        email: 'bad_email',
        phoneNumber: '',
        name: '',
        lastName: '',
        password: 'bad_pass',
      };
      const validationErrorMessages = [
        'email must be an email',
        'phoneNumber should not be empty',
        'name should not be empty',
        'lastName should not be empty',
        'invalid password format',
      ];
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send(postBody)
        .expect(HttpStatus.BAD_REQUEST)
        .then((res) =>
          expect(res.body.message).toEqual(validationErrorMessages),
        );
    });
  });

  describe('POST /login', () => {
    const mockedSession = {
      accessToken: { jwtToken: 'access_token', payload: {} },
      clockDrift: null,
      idToken: { jwtToken: 'id_token', payload: {} },
      refreshToken: { token: 'refresh_token' },
    };

    it('Should login a user', async () => {
      jest
        .spyOn(authProvider, 'login')
        .mockResolvedValue(mockedSession as unknown as CognitoUserSession);
      const postBody: LoginDto = {
        email: 'test@email.com',
        password: 'Password1.',
      };
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(postBody)
        .expect(HttpStatus.CREATED);

      expect(response.body).toEqual(mockedSession);
    });

    it('Should try to login with invalid information', () => {
      jest
        .spyOn(authProvider, 'login')
        .mockResolvedValue(mockedSession as unknown as CognitoUserSession);
      const postBody: LoginDto = {
        email: 'bad_email',
        password: 'bad_pass',
      };
      const validationErrorMessages = [
        'email must be an email',
        'invalid password format',
      ];
      return request(app.getHttpServer())
        .post('/auth/login')
        .send(postBody)
        .expect(HttpStatus.BAD_REQUEST)
        .then((res) =>
          expect(res.body.message).toEqual(validationErrorMessages),
        );
    });

    it('Should login an non existing user', () => {
      const error = new NotFoundException('User does not exist.');
      jest.spyOn(authProvider, 'login').mockImplementation(() => {
        throw error;
      });
      const postBody: LoginDto = {
        email: 'test@email.com',
        password: 'Password1.',
      };
      return request(app.getHttpServer())
        .post('/auth/login')
        .send(postBody)
        .expect(error.getStatus());
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
