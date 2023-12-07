import { join } from 'path';
import * as io from 'socket.io-client';
import { Socket } from 'socket.io-client';
import * as request from 'supertest';

import { DoubleDiceBoardConfigDto } from '../dto/DoubleDiceBoardConfigDto';
import { DoubleDiceBoardInputNames } from '../enums/DoubleDiceBoard.enums';

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
  endGame,
  joinLobby,
  loadBox,
  sendInput,
  startGame,
} from '@/module/lobby/interface/__test__/client/together.client.service';

const rollDices = (client: Socket) =>
  new Promise<void>((resolve) => {
    sendInput(client, {
      name: DoubleDiceBoardInputNames.rollDices,
    });
    client.on(ServerEvents.lobbyStatus, (lobby) => {
      const player = lobby.currentGame.players.find(
        (player) => player.id === client.id,
      );
      expect(typeof player.lastRolls.row).toBe('number');
      expect(typeof player.lastRolls.column).toBe('number');
      expect(player.lastRoll).not.toBe(0);
      resolve();
    });
  });

const endTurn = (client: Socket) =>
  new Promise<void>((resolve) => {
    sendInput(client, {
      name: DoubleDiceBoardInputNames.endTurn,
    });
    client.on(ServerEvents.lobbyStatus, (lobby) => {
      if (lobby.currentGame.turnPlayer.id !== client.id) {
        resolve();
      }
    });
  });

describe('DoubleDiceBoard game', () => {
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

  it('Should ( POST ) create a new Double dice board game config', async () => {
    const doubleDiceBoardConfig: DoubleDiceBoardConfigDto = {
      doubleDiceBoardTiles: new Array(36).fill(0).map((_el, index) => ({
        text: `${index + 1}`,
      })),
      configType: 'DoubleDiceBoardConfig',
      gameName: 'Double dice board',
      title: 'Double dice board test',
      id: undefined,
      doubleDiceBoardMinRounds: 2,
    };
    const config: NewGameConfigDto = {
      config: doubleDiceBoardConfig,
    };
    const { body } = await request(app.getHttpServer())
      .post('/game-config')
      .send(config);

    expect(body.gameName).toBe(config.config.gameName);
    expect(body.configType).toBe(config.config.configType);
    expect(body.doubleDiceBoardTiles).toHaveLength(36);
  });

  it('Should load a box in a lobby and play "Double dice board"', async () => {
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
    const gameName = 'Double dice board';
    const startGameResponse = await startGame(client, gameName);
    expect(startGameResponse).toBe(`${gameName} has started`);

    const playGameLoop = async () =>
      new Promise<void>(async (resolve) => {
        client.on(ServerEvents.gameEvent, (event) => {
          if (event.event === ServerEvents.endGameResponse) {
            resolve();
          }
        });

        await rollDices(guestClient1);
        await endTurn(guestClient1);
        await rollDices(guestClient2);
        await endTurn(guestClient2);
        await rollDices(guestClient1);
        await endTurn(guestClient1);
        await rollDices(guestClient2);
        await endTurn(guestClient2);
        await endGame(client);
      });
    await playGameLoop();
    guestClient1.disconnect();
    guestClient2.disconnect();
  });

  it('Should pass the turn if player disconnects', async () => {
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

    const guestClient3 = io.connect(baseAddress);
    const guest3Dto: NewGuestDto = {
      name: 'guest 3',
      pin: '',
    };
    await authenticate(client);
    const { pin } = await createLobby(client);

    guest1Dto.pin = pin;
    guest2Dto.pin = pin;
    guest3Dto.pin = pin;

    const loadBoxResponse = await loadBox(client, BOX_ID);

    await joinLobby(guestClient1, guest1Dto);
    await joinLobby(guestClient2, guest2Dto);
    await joinLobby(guestClient3, guest3Dto);

    expect(loadBoxResponse).toBe('Box selected');
    const gameName = 'Double dice board';
    const startGameResponse = await startGame(client, gameName);
    expect(startGameResponse).toBe(`${gameName} has started`);

    const playGameLoop = async () =>
      new Promise<void>(async (resolve) => {
        client.on(ServerEvents.gameEvent, (event) => {
          if (event.event === ServerEvents.endGameResponse) {
            resolve();
          }
        });

        await rollDices(guestClient1);
        await endTurn(guestClient1);
        await rollDices(guestClient2);
        await endTurn(guestClient2);
        await rollDices(guestClient3);
        await endTurn(guestClient3);
        guestClient1.disconnect();
        await rollDices(guestClient2);
        await endTurn(guestClient2);
        await rollDices(guestClient3);
        await endTurn(guestClient3);
        await rollDices(guestClient2);
        await endTurn(guestClient2);
        await rollDices(guestClient3);
        await endTurn(guestClient3);
        await endGame(client);
      });
    await playGameLoop();
    guestClient2.disconnect();
    guestClient3.disconnect();
  });
});
