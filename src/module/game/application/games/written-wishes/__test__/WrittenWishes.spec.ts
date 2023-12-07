import { join } from 'path';
import * as io from 'socket.io-client';
import { Socket } from 'socket.io-client';
import * as request from 'supertest';

import { WrittenWishesConfigDto } from '../dto/WrittenWishesConfig.dto';
import { WrittenWishesPlayer } from '../entities/WrittenWishesPlayer';
import { WrittenWishesInputNames } from '../enums/WrittenWishes.enums';

import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { loadFixtures } from '@data/fixture/util/loader';

import { AppModule } from '@/module/app.module';
import { NewGameConfigDto } from '@/module/game-config/application/dto/new-game-config.dto';
import { NewGuestDto } from '@/module/lobby/application/dto/new-guest.dto';
import { ServerEvents } from '@/module/lobby/application/events/server.events';
import {
  authenticate,
  createLobby,
  joinLobby,
  loadBox,
  sendInput,
  startGame,
} from '@/module/lobby/interface/__test__/client/together.client.service';

const sendWishes = (client: Socket, wishes: string[]) =>
  new Promise<void>((resolve) => {
    sendInput(client, {
      name: WrittenWishesInputNames.wishesInput,
      payload: wishes,
    });
    client.on(ServerEvents.lobbyStatus, (lobby) => {
      const player: WrittenWishesPlayer = lobby.currentGame.players.find(
        (player: WrittenWishesPlayer) => player.id === client.id,
      );
      if (JSON.stringify(player.wishes) === JSON.stringify(wishes)) {
        resolve();
      }
    });
  });

const finishWritting = (client: Socket) =>
  new Promise<void>((resolve) => {
    sendInput(client, {
      name: WrittenWishesInputNames.finishWritting,
    });
    client.on(ServerEvents.lobbyStatus, (lobby) => {
      const player: WrittenWishesPlayer = lobby.currentGame.players.find(
        (player: WrittenWishesPlayer) => player.id === client.id,
      );
      if (player.hasFinishedWritting) {
        resolve();
      }
    });
  });

describe('WrittenWishes game', () => {
  let app: INestApplication;
  let client: io.Socket;
  let baseAddress: string;

  const access_token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RAZW1haWwuY29tIn0.lyGJV0QIRyp0dXkb8XGuOcOa5_P45CG_PKwd2cNRc_o';
  const BOX_ID = 1;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    await loadFixtures(
      `${__dirname}/fixture`,
      join(__dirname, '..', '..', '..', '..', '..', '..', '..', 'ormconfig.ts'),
    );

    app = moduleRef.createNestApplication();
    await app.init();
    const { port } = app.getHttpServer().listen().address();

    baseAddress = `http://localhost:${port}`;
  });

  beforeEach(() => {
    client = io.connect(baseAddress, {
      query: { authorization: access_token },
    });
  });

  afterEach(() => {
    client.disconnect();
    client.removeAllListeners();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should ( POST ) create a new Written wishes game config', async () => {
    const writtenWishesConfig: WrittenWishesConfigDto = {
      wishesAmount: 3,
      configType: 'WrittenWishesConfig',
      gameName: 'Written wishes',
      title: 'Written wishes test',
      id: undefined,
    };
    const config: NewGameConfigDto = {
      config: writtenWishesConfig,
    };
    const { body } = await request(app.getHttpServer())
      .post('/game-config')
      .send(config);
    expect(body.gameName).toBe(config.config.gameName);
    expect(body.configType).toBe(config.config.configType);
  });

  it('Should load a box in a lobby and play "Written wishes"', async () => {
    const guestClient1 = io.connect(baseAddress);
    const guest1Dto: NewGuestDto = {
      name: 'guest 1',
      pin: '',
    };
    const guestClient2 = io.connect(baseAddress);
    const guest2Dto: NewGuestDto = {
      name: 'guest 2',
      pin: '',
    };
    await authenticate(client);
    const { pin } = await createLobby(client);

    guest1Dto.pin = pin;
    guest2Dto.pin = pin;
    const loadBoxResponse = await loadBox(client, BOX_ID);
    await joinLobby(guestClient1, guest1Dto);
    await joinLobby(guestClient2, guest2Dto);

    expect(loadBoxResponse).toBe('Box selected');
    const gameName = 'Written wishes';
    const startGameResponse = await startGame(client, gameName);
    expect(startGameResponse).toBe(`${gameName} has started`);

    const testWishes = ['a', 'b', 'c'];

    await sendWishes(guestClient1, testWishes);
    await finishWritting(guestClient1);
    await sendWishes(guestClient2, testWishes);
    await finishWritting(guestClient2);

    guestClient1.disconnect();
    guestClient2.disconnect();
  });

  it('Should load a box in a lobby and play "Written wishes" with bad input timming', async () => {
    const guestClient1 = io.connect(baseAddress);
    const guest1Dto: NewGuestDto = {
      name: 'guest 1',
      pin: '',
    };
    const guestClient2 = io.connect(baseAddress);
    const guest2Dto: NewGuestDto = {
      name: 'guest 2',
      pin: '',
    };
    await authenticate(client);
    const { pin } = await createLobby(client);

    guest1Dto.pin = pin;
    guest2Dto.pin = pin;
    const loadBoxResponse = await loadBox(client, BOX_ID);
    await joinLobby(guestClient1, guest1Dto);
    await joinLobby(guestClient2, guest2Dto);

    expect(loadBoxResponse).toBe('Box selected');
    const gameName = 'Written wishes';
    const startGameResponse = await startGame(client, gameName);
    expect(startGameResponse).toBe(`${gameName} has started`);

    const sendWishes = (client: Socket, wishes: string[]) =>
      new Promise<void>((resolve) => {
        sendInput(client, {
          name: WrittenWishesInputNames.wishesInput,
          payload: wishes,
        });
        client.on(ServerEvents.lobbyStatus, (lobby) => {
          const player: WrittenWishesPlayer = lobby.currentGame.players.find(
            (player: WrittenWishesPlayer) => player.id === client.id,
          );
          if (JSON.stringify(player.wishes) === JSON.stringify(wishes)) {
            resolve();
          }
        });
      });

    const finishWritting = (client: Socket) =>
      new Promise<void>((resolve) => {
        sendInput(client, {
          name: WrittenWishesInputNames.finishWritting,
        });
        client.on(ServerEvents.lobbyStatus, (lobby) => {
          const player: WrittenWishesPlayer = lobby.currentGame.players.find(
            (player: WrittenWishesPlayer) => player.id === client.id,
          );
          if (player.hasFinishedWritting) {
            resolve();
          }
        });
      });

    const testWishes = ['a', 'b', 'c'];

    await sendWishes(guestClient1, testWishes);
    await finishWritting(guestClient1);

    sendInput(guestClient1, {
      name: WrittenWishesInputNames.wishesInput,
      payload: testWishes,
    });
    sendInput(guestClient1, {
      name: WrittenWishesInputNames.finishWritting,
    });
    await sendWishes(guestClient2, testWishes);
    await finishWritting(guestClient2);

    sendInput(guestClient2, {
      name: WrittenWishesInputNames.wishesInput,
      payload: testWishes,
    });
    sendInput(guestClient2, {
      name: WrittenWishesInputNames.finishWritting,
    });

    guestClient1.disconnect();
    guestClient2.disconnect();
  });
});
