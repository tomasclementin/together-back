import { join } from 'path';
import * as request from 'supertest';

import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { loadFixtures } from '@data/fixture/util/loader';

import { AppModule } from '@/module/app.module';
import { WhoIsConfigDto } from '@/module/game/application/games/who-is/dto/WhoIsConfig.dto';

describe('GameConfig', () => {
  let app: INestApplication;

  const whoIsConfig: WhoIsConfigDto = {
    configType: 'WhoIsConfig',
    title: 'Who is',
    gameName: 'Who is',
    whoIsCards: [{ text: 'card 1' }, { text: 'card 2' }, { text: 'card 3' }],
    id: undefined,
  };

  const newGameConfig = {
    config: whoIsConfig,
  };
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    await loadFixtures(
      `${__dirname}/fixture`,
      join(__dirname, '..', '..', '..', '..', '..', 'ormconfig.ts'),
    );

    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe('Get all - [GET /game-config]', () => {
    it('Should return an array of game config', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/game-config')
        .expect(HttpStatus.OK);

      expect(body.gameConfigs).toHaveLength(1);
      expect(body.count).toBe(1);
    });
  });

  describe('Get game config by id - [GET /game-config/:id]', () => {
    it('Should return a game config correctly', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/game-config/1')
        .expect(HttpStatus.OK);

      expect(body.id).toBe(1);
      expect(body.gameName).toBe('Who is');
      expect(body.configType).toBe('WhoIsConfig');
    });

    it('Should return an error for game config not found', async () => {
      const mockResponse = {
        statusCode: 404,
        message: 'Game config not found',
        error: 'Not Found',
      };

      const { body } = await request(app.getHttpServer())
        .get('/game-config/999')
        .expect(HttpStatus.NOT_FOUND);

      expect(body).toStrictEqual(mockResponse);
    });
  });

  describe('POST Create a new game config - [POST /game-config]', () => {
    it('Should return a new game config', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/game-config')
        .send(newGameConfig);

      expect(body.gameName).toBe(newGameConfig.config.gameName);
      expect(body.whoIsCards).toHaveLength(3);
    });
    it('Should throw an exception when creating cofing with of a non-existent game', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/game-config')
        .send({
          config: {
            configType: 'non existent',
            maxPlayers: 2,
            title: 'non existent',
            gameName: 'non existent',
          },
        });

      expect(body.message).toBe('Game Type does not exist');
    });
  });

  describe('PUT Update a game config - [PUT game-config/:id]', () => {
    const updateGameConfig = {
      config: {
        configType: 'WhoIsConfig',
        title: 'Who is',
        maxPlayers: 2,
        gameName: 'Who is',
        cards: [{ id: 1, text: 'card 4' }],
      },
    };

    it('Should return an updated game config', async () => {
      const { body } = await request(app.getHttpServer())
        .put('/game-config/1')
        .send(updateGameConfig)
        .expect(HttpStatus.OK);

      expect(body.id).toBe(1);
      expect(body.cards[0].text).toBe(updateGameConfig.config.cards[0].text);
    });

    it('Should return a Not Found error if game config to update does not exist', async () => {
      const mockResponse = {
        statusCode: 404,
        message: 'Game config not found',
        error: 'Not Found',
      };

      const { body } = await request(app.getHttpServer())
        .put('/game-config/999')
        .send(updateGameConfig)
        .expect(HttpStatus.NOT_FOUND);

      expect(body).toStrictEqual(mockResponse);
    });
  });

  describe('DELETE Delete a game config - [DELETE /game-config/:id]', () => {
    it('Should return a deleted game config', async () => {
      const { body } = await request(app.getHttpServer())
        .delete('/game-config/2')
        .expect(HttpStatus.OK);

      expect(body.id).toBe(2);
    });

    it('Should return an error for game config not found', async () => {
      const mockResponse = {
        statusCode: 404,
        message: 'Game config not found',
        error: 'Not Found',
      };

      const { body } = await request(app.getHttpServer())
        .delete('/game-config/999')
        .expect(HttpStatus.NOT_FOUND);

      expect(body).toStrictEqual(mockResponse);
    });
  });
  afterAll(async () => {
    await app.close();
  });
});
