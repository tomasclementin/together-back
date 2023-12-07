import { join } from 'path';
import * as request from 'supertest';

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { Test } from '@nestjs/testing';

import { loadFixtures } from '@data/fixture/util/loader';

import { AppModule } from '@/module/app.module';

describe('User', () => {
  let app: INestApplication;
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
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('Get all - [GET /user]', () => {
    it('Should return an array of users', async () => {
      const response = await request(app.getHttpServer()).get('/user');
      expect(response.body.users).toHaveLength(2);
      expect(response.body.users[0].id).toBe(1);
      expect(response.body.users[1].id).toBe(2);
    });
  });

  describe('Get one User - [GET /User/:id]', () => {
    it('Should return a User correctly', async () => {
      const response = await request(app.getHttpServer())
        .get('/user/1')
        .expect(HttpStatus.OK);

      expect(response.body.id).toBe(1);
    });

    it('Should return an error for User not found', async () => {
      const mockResponse = {
        statusCode: 404,
        message: 'User not found',
        error: 'Not Found',
      };

      const response = await request(app.getHttpServer())
        .get('/User/999')
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body).toStrictEqual(mockResponse);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
