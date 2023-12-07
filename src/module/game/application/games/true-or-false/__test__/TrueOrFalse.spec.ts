import { join } from 'path';
import * as io from 'socket.io-client';
import { Socket } from 'socket.io-client';
import * as request from 'supertest';

import { TrueOrFalseConfigDto } from '../dto/TrueOrFalseConfigDto';
import {
  TrueOrFalseInputNames,
  TrueOrFalseStates,
  TrueOrFalseStory,
} from '../enums/TrueOrFalse.enums';

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

const rollDice = (client: Socket) =>
  new Promise<void>((resolve) => {
    sendInput(client, {
      name: TrueOrFalseInputNames.rollDice,
    });
    client.on(ServerEvents.lobbyStatus, async (lobby) => {
      if (lobby.currentGame.isLastRound) {
        resolve();
      }
      const player = lobby.currentGame.players.find(
        (player) => player.id === client.id,
      );
      expect(typeof player.lastRoll).toBe('number');
      expect(typeof player.lastRoll).not.toBe(0);
      resolve();
    });
  });

const chooseOption = (client: Socket, option: TrueOrFalseStory) =>
  new Promise<void>((resolve) => {
    sendInput(client, {
      name: TrueOrFalseInputNames.selectTrueOrFalseOption,
      payload: option,
    });
    client.on(ServerEvents.lobbyStatus, (lobby) => {
      if (lobby.currentGame.isLastRound) {
        resolve();
      }
      const player = lobby.currentGame.players.find(
        (player) => player.id === client.id,
      );
      if (player.choosenOption === option) {
        resolve();
      }
    });
  });

const endTurn = (client: Socket) =>
  new Promise<void>((resolve) => {
    sendInput(client, {
      name: TrueOrFalseInputNames.endTurn,
    });
    client.on(ServerEvents.lobbyStatus, (lobby) => {
      if (lobby.currentGame.turnPlayer.id !== client.id) {
        resolve();
      }
    });
  });

describe('TrueOrFalse game', () => {
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

  it('Should ( POST ) create a new True or false game config', async () => {
    const trueOrFalseConfig: TrueOrFalseConfigDto = {
      trueOrFalseTiles: new Array(10).fill(0).map((_el, index) => ({
        text: `tile ${index + 1}`,
      })),
      configType: 'TrueOrFalseConfig',
      gameName: 'True or false',
      title: 'True or false test',
      id: undefined,
    };
    const config: NewGameConfigDto = {
      config: trueOrFalseConfig,
    };
    const { body } = await request(app.getHttpServer())
      .post('/game-config')
      .send(config);
    expect(body.gameName).toBe(config.config.gameName);
    expect(body.configType).toBe(config.config.configType);
    expect(body.trueOrFalseTiles).toHaveLength(10);
  });

  it('Should load a box in a lobby and play "True or false"', async () => {
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
    const gameName = 'True or false';
    const startGameResponse = await startGame(client, gameName);
    expect(startGameResponse).toBe(`${gameName} has started`);

    client.on(ServerEvents.gameEvent, (event) => {
      if (event.event === ServerEvents.endGameResponse) {
        guestClient1.disconnect();
        guestClient2.disconnect();
      }
    });
    const playGameLoop = async () =>
      new Promise<void>(async (resolve) => {
        client.on(ServerEvents.lobbyStatus, (lobby) => {
          if (
            lobby.currentGame.currentState === TrueOrFalseStates.showingScores
          ) {
            resolve();
          }
        });

        while (true) {
          await rollDice(guestClient1);
          await chooseOption(guestClient2, TrueOrFalseStory.true);
          await endTurn(guestClient1);
          await rollDice(guestClient2);
          await chooseOption(guestClient1, TrueOrFalseStory.true);
          await endTurn(guestClient2);
        }
      });
    await playGameLoop();
    await endGame(client);
  });

  it('Should load a box in a lobby and play "True or false" with bad inputs', async () => {
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
    const gameName = 'True or false';
    const startGameResponse = await startGame(client, gameName);
    expect(startGameResponse).toBe(`${gameName} has started`);

    client.on(ServerEvents.gameEvent, (event) => {
      if (event.event === ServerEvents.endGameResponse) {
        guestClient1.disconnect();
        guestClient2.disconnect();
      }
    });

    const playGameLoop = async () =>
      new Promise<void>(async (resolve) => {
        client.on(ServerEvents.lobbyStatus, (lobby) => {
          if (
            lobby.currentGame.currentState === TrueOrFalseStates.showingScores
          ) {
            resolve();
          }
        });

        while (true) {
          await rollDice(guestClient1);

          sendInput(guestClient2, {
            name: TrueOrFalseInputNames.rollDice,
          });

          sendInput(guestClient2, {
            name: TrueOrFalseInputNames.endTurn,
          });
          await chooseOption(guestClient2, TrueOrFalseStory.true);
          await endTurn(guestClient1);
          await rollDice(guestClient2);

          sendInput(guestClient1, {
            name: TrueOrFalseInputNames.rollDice,
          });

          sendInput(guestClient1, {
            name: TrueOrFalseInputNames.endTurn,
          });
          await chooseOption(guestClient1, TrueOrFalseStory.true);
          await endTurn(guestClient2);
        }
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
    await joinLobby(guestClient3, guest2Dto);

    expect(loadBoxResponse).toBe('Box selected');
    const gameName = 'True or false';
    const startGameResponse = await startGame(client, gameName);
    expect(startGameResponse).toBe(`${gameName} has started`);
    client.on(ServerEvents.gameEvent, (event) => {
      if (event.event === ServerEvents.endGameResponse) {
        guestClient1.disconnect();
        guestClient2.disconnect();
      }
    });
    const playGameLoop = async () =>
      new Promise<void>(async (resolve) => {
        client.on(ServerEvents.lobbyStatus, (lobby) => {
          if (
            lobby.currentGame.currentState === TrueOrFalseStates.showingScores
          ) {
            resolve();
          }
        });
        await rollDice(guestClient1);
        await chooseOption(guestClient2, TrueOrFalseStory.true);
        await chooseOption(guestClient3, TrueOrFalseStory.true);
        await endTurn(guestClient1);
        await rollDice(guestClient2);
        await chooseOption(guestClient1, TrueOrFalseStory.true);
        await chooseOption(guestClient3, TrueOrFalseStory.true);
        await endTurn(guestClient2);
        guestClient3.disconnect();
        while (true) {
          await rollDice(guestClient1);
          await chooseOption(guestClient2, TrueOrFalseStory.true);
          await endTurn(guestClient1);
          await rollDice(guestClient2);
          await chooseOption(guestClient1, TrueOrFalseStory.true);
          await endTurn(guestClient2);
        }
      });
    await playGameLoop();
    await endGame(client);
  });
});
