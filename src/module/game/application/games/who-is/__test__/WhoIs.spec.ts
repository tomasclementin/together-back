import { join } from 'path';
import * as io from 'socket.io-client';
import { Socket } from 'socket.io-client';

import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { loadFixtures } from '@data/fixture/util/loader';

import { AppModule } from '@/module/app.module';
import { WhoIsInputNames } from '@/module/game/application/games/who-is/enums/WhoIs.enums';
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

describe('WhoIs game', () => {
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

  it('Should load a box in a lobby and play "Who is" with one initial card and one game card)', async () => {
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
    const gameName = 'Who is';
    const startGameResponse = await startGame(client, gameName);
    expect(startGameResponse).toBe(`${gameName} has started`);

    const playerChoose = async (client: Socket, option: string) => {
      new Promise<void>((resolve) => {
        client.once(ServerEvents.lobbyStatus, (lobby) => {
          const player = lobby.currentGame.players.find(
            (player) => player.id === client.id,
          );
          if (player.chosenOption === option) {
            resolve();
          }
        });
        sendInput(client, {
          name: WhoIsInputNames.chooseCard,
          payload: { playerId: option },
        });
      });
    };

    const nextCard = async () =>
      new Promise<void>((resolve) => {
        client.once(ServerEvents.lobbyStatus, () => {
          resolve();
        });
        client.on(ServerEvents.gameEvent, (event) => {
          if (event.event === ServerEvents.endGameResponse) {
            guestClient1.disconnect();
            guestClient2.disconnect();
            resolve();
          }
        });
        sendInput(client, {
          name: WhoIsInputNames.nextCard,
        });
      });
    await playerChoose(guestClient1, guestClient2.id);
    await playerChoose(guestClient2, guestClient2.id);
    await nextCard();
    await playerChoose(guestClient1, guestClient2.id);
    await playerChoose(guestClient2, guestClient2.id);
    await nextCard();
    await endGame(client);
  });
});
