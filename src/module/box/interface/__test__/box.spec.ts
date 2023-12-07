import { join } from 'path';
import * as request from 'supertest';

import { AddGameToBoxDto } from '../../application/dto/add-game-to-box.dto';
import { CreateBoxDto } from '../../application/dto/create-box.dto';
import { UpdateBoxDto } from '../../application/dto/update-box.dto';

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { Test } from '@nestjs/testing';

import { loadFixtures } from '@data/fixture/util/loader';

import { AppModule } from '@/module/app.module';

describe('Box', () => {
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

  describe('Get all - [GET /box]', () => {
    it('Should return an array of boxes', async () => {
      const response = await request(app.getHttpServer()).get('/box');

      expect(response.body.boxes).toHaveLength(3);
      expect(response.body.boxes[0].id).toBe(1);
      expect(response.body.boxes[1].id).toBe(2);
      expect(response.body.boxes[2].id).toBe(3);
    });
  });

  describe('Get one box - [GET /box/:id]', () => {
    it('Should return a box correctly', async () => {
      const response = await request(app.getHttpServer())
        .get('/box/1')
        .expect(HttpStatus.OK);

      expect(response.body.id).toBe(1);
      expect(response.body.title).toBe('Box test 1');
    });

    it('Should return an error for box not found', async () => {
      const mockResponse = {
        statusCode: 404,
        message: 'Box not found',
        error: 'Not Found',
      };

      const response = await request(app.getHttpServer())
        .get('/box/999')
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body).toStrictEqual(mockResponse);
    });
  });

  describe('DELETE Delete a box - [DELETE /box/:id]', () => {
    it('Should return a deleted box', async () => {
      const { body } = await request(app.getHttpServer())
        .delete('/box/3')
        .expect(HttpStatus.OK);

      expect(body.title).toEqual('Box test 3');
    });

    it('Should return an error for box not found', async () => {
      const mockResponse = {
        statusCode: 404,
        message: 'Box not found',
        error: 'Not Found',
      };

      const response = await request(app.getHttpServer())
        .delete('/box/999')
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body).toStrictEqual(mockResponse);
    });
  });

  describe('DELETE Delete a game config from a box - [DELETE /box/:id/game-config]', () => {
    it('Should delete a game config from a box ', async () => {
      const response = await request(app.getHttpServer())
        .delete('/box/1/game-config')
        .send({ configId: 2 })
        .expect(HttpStatus.OK);
      expect(response.body.id).toBe(1);
      expect(response.body.phases).toHaveLength(0);
    });

    it('Should throw an error if the game config does not exist on the box', async () => {
      const response = await request(app.getHttpServer())
        .delete('/box/1/game-config')
        .send({ configId: 2 })
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body.message).toBe(
        'The game config does not exist in the box or has already been deleted',
      );
    });
  });

  describe('POST Create a new box - [POST Box]', () => {
    it('Should return a new box', async () => {
      const newBox: CreateBoxDto = {
        title: 'Box test 3',
        description: 'Box test 3 description',
        maxPlayers: 6,
      };

      const response = await request(app.getHttpServer())
        .post('/box')
        .send(newBox)
        .expect(HttpStatus.CREATED);

      expect(response.body.id).toBe(4);
      expect(response.body.title).toBe(newBox.title);
    });
    it('Should return bad request if the payload has validation errors', async () => {
      const newBox = {
        title: 3,
        description: 1,
        maxPlayers: 'test error',
      };

      await request(app.getHttpServer())
        .post('/box')
        .send(newBox)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('POST add game config - [POST box/:boxId/game-config]', () => {
    it('Should add a game config to a box', async () => {
      const payload: AddGameToBoxDto = {
        configId: 4,
        phaseOrder: 2,
        phaseName: 'connect',
      };
      const response = await request(app.getHttpServer())
        .post('/box/2/game-config')
        .send(payload)
        .expect(HttpStatus.CREATED);

      expect(response.body.id).toBe(2);
      expect(response.body.phases).toHaveLength(2);
      expect(response.body.phases[1].gameConfig.id).toBe(4);
    });
    it('Should throw an error if the phase order already exists', async () => {
      const payload: AddGameToBoxDto = {
        configId: 4,
        phaseOrder: 1,
        phaseName: 'connect',
      };
      const response = await request(app.getHttpServer())
        .post('/box/2/game-config')
        .send(payload)
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body.message).toBe(
        'The box already have a phase with this order number',
      );
    });
    it('Should throw an error if the game config already exists in the box', async () => {
      const payload: AddGameToBoxDto = {
        configId: 4,
        phaseOrder: 3,
        phaseName: 'connect',
      };
      const response = await request(app.getHttpServer())
        .post('/box/2/game-config')
        .send(payload)
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body.message).toBe(
        'The game config has already been added to a box',
      );
    });

    it('Should throw an error if the game config does not exist', async () => {
      const payload: AddGameToBoxDto = {
        configId: 9999,
        phaseOrder: 2,
        phaseName: 'connect',
      };
      const response = await request(app.getHttpServer())
        .post('/box/2/game-config')
        .send(payload)
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body.message).toBe('Game config not found');
    });
  });

  describe('PUT Update a box - [PUT box/:id]', () => {
    it('Should return an updated box', async () => {
      const boxUpdated: UpdateBoxDto = {
        title: 'Box Updated',
        id: undefined,
      };

      const response = await request(app.getHttpServer())
        .put('/box/1')
        .send(boxUpdated)
        .expect(HttpStatus.OK);

      expect(response.body.id).toBe(1);
      expect(response.body.title).toBe(boxUpdated.title);
    });

    it('Should return a Not Found error if box to update does not exist', async () => {
      const mockResponse = {
        statusCode: 404,
        message: 'Box not found',
        error: 'Not Found',
      };

      const boxUpdated: UpdateBoxDto = {
        title: 'Box Updated',
        id: undefined,
      };

      const response = await request(app.getHttpServer())
        .put('/box/999')
        .send(boxUpdated)
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body).toStrictEqual(mockResponse);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
