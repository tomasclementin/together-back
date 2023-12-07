import { join } from 'path';
import * as io from 'socket.io-client';

import { LobbyInfoDto } from '../../application/dto/lobby-info.dto';
import { NewGuestDto } from '../../application/dto/new-guest.dto';
import { ClientEvents } from '../../application/events/client.events';
import { ServerEvents } from '../../application/events/server.events';
import {
  authenticate,
  createLobby,
  endGame,
  joinLobby,
  loadBox,
  sendMenuStatus,
  setLobbyAdmin,
  startGame,
} from './client/together.client.service';

import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { loadFixtures } from '@data/fixture/util/loader';

import { AppModule } from '@/module/app.module';

describe('Lobby events', () => {
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
      join(__dirname, '..', '..', '..', '..', '..', 'ormconfig.ts'),
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

  describe('Connection', () => {
    it('Should receive a message when a client connects to the server', (done) => {
      const expectedMessage = 'Welcome';

      client.on(ServerEvents.connectionResponse, (message) => {
        expect(message).toEqual(expectedMessage);
        done();
      });
    });
  });

  describe('Authentication', () => {
    it('Should authenticate the user with an account', async () => {
      const response = await authenticate(client);
      expect(response).toBe('Authenticated');
    });

    it('Should throw when a connection without a token tries to authenticate', async () => {
      const guestClient = io.connect(baseAddress);

      try {
        await authenticate(guestClient);
      } catch (err) {
        expect(err.message).toEqual('Unauthorized');
        guestClient.disconnect();
      }
    });
  });

  describe('Lobby Creation', () => {
    it('Should create a lobby as an authenticated client connection', async () => {
      await authenticate(client);

      const response = await createLobby(client);

      expect(response).toHaveProperty('pin');
      expect(typeof response.pin).toBe('string');
    });

    it('Should trigger an exception event when trying to create a lobby as an unauthenticated client connection', async () => {
      try {
        await createLobby(client);
      } catch (err) {
        expect(err.message).toBe('Not authorized');
      }
    });
  });

  describe('Joining a Lobby', () => {
    it('Should add a guest to a lobby and notify the entire lobby', async () => {
      await authenticate(client);
      const { pin } = await createLobby(client);
      const guestClient = io.connect(baseAddress);
      const guest1Dto: NewGuestDto = {
        name: 'guest 1',
        pin: pin,
      };
      await loadBox(client, BOX_ID);
      const response = await joinLobby(guestClient, guest1Dto);

      expect(response).toEqual('Successfully joined');

      client.on(ServerEvents.lobbyStatus, (message) => {
        expect(message.guests).toHaveLength(1);
      });
      client.on(ServerEvents.lobbyNotification, (message) => {
        expect(message).toEqual(`${guest1Dto.name} has joined`);
        guestClient.disconnect();
      });
    });

    it('Should notify when a guest disconnects', async () => {
      await authenticate(client);
      const { pin } = await createLobby(client);
      const guestClient = io.connect(baseAddress);
      const guest1Dto: NewGuestDto = {
        name: 'guest 1',
        pin: pin,
      };
      await loadBox(client, BOX_ID);
      await joinLobby(guestClient, guest1Dto);

      client.on(ServerEvents.lobbyNotification, (message) => {
        if (message === `${guest1Dto.name} has joined`) {
          expect(message).toEqual(`${guest1Dto.name} has joined`);
          guestClient.disconnect();
        }
        if (message === `${guest1Dto.name} has disconnected`) {
          expect(message).toEqual(`${guest1Dto.name} has disconnected`);
        }
      });
    });

    it('Should throw a WsException when the pin is invalid', async () => {
      await authenticate(client);
      await createLobby(client);
      const guestClient = io.connect(baseAddress);
      const guest1Dto: NewGuestDto = {
        name: 'guest 1',
        pin: 'invalid pin',
      };
      try {
        await loadBox(client, BOX_ID);
        await joinLobby(guestClient, guest1Dto);
      } catch (err) {
        expect(err.message).toEqual('Lobby does not exists');
        guestClient.disconnect();
      }
    });
    it('Should throw a WsException when max number of guests is surpassed (max number determined by box)', async () => {
      await authenticate(client);
      const { pin } = await createLobby(client);
      const maxGuests = 7;
      const guestClients = [];

      const guestDtos = Array.from({ length: maxGuests }, (_, index) => ({
        name: `guest ${index + 1}`,
        pin: pin,
      }));

      guestDtos.forEach(() => {
        const guestClient = io.connect(baseAddress);
        guestClients.push(guestClient);
      });

      await loadBox(client, BOX_ID);

      try {
        for (let i = 0; i < maxGuests; i++) {
          await joinLobby(guestClients[i], guestDtos[i]);
        }
        await joinLobby(guestClients[maxGuests], guestDtos[maxGuests]);
      } catch (err) {
        const errorMessage = 'Lobby is full';
        expect(err.message).toEqual(errorMessage);
      } finally {
        for (const guestClient of guestClients) {
          guestClient.disconnect();
        }
      }
    });
  });

  describe('Menu Status', () => {
    it('Should send menu status to the guests', async () => {
      await authenticate(client);
      const { pin } = await createLobby(client);
      const guest1Client = io.connect(baseAddress);
      const guest1Dto: NewGuestDto = {
        name: 'guest 1',
        pin: pin,
      };

      const menuStatus = { menu: 'test' };
      await loadBox(client, BOX_ID);
      await joinLobby(guest1Client, guest1Dto);

      guest1Client.on(ServerEvents.menuStatusResponse, (message) => {
        expect(message).toEqual(menuStatus.menu);
        guest1Client.disconnect();
      });
      await sendMenuStatus(client, menuStatus);
    });

    it('Should throw when sending menu status without being connected to a lobby', async () => {
      await authenticate(client);
      try {
        await sendMenuStatus(client, { menu: 'test' });
      } catch (err) {
        expect(err.message).toEqual('You are not connected to a lobby');
      }
    });
  });

  describe('Loading a Box', () => {
    it('Should load a box', async () => {
      await authenticate(client);
      await createLobby(client);
      const response = await loadBox(client, BOX_ID);
      expect(response).toBe('Box selected');
    });

    it('Should throw a WsException when loading a box that does not exist', async () => {
      await authenticate(client);
      await createLobby(client);
      try {
        await loadBox(client, 999);
      } catch (err) {
        expect(err.message).toEqual('Box not found');
      }
    });
  });

  describe('Starting and Ending a Game', () => {
    it('Should start a game and end it', async () => {
      await authenticate(client);
      const { pin } = await createLobby(client);
      const guest1Client = io.connect(baseAddress);
      const guest2Client = io.connect(baseAddress);
      const guest1Dto: NewGuestDto = {
        name: 'guest 1',
        pin: pin,
      };
      const guest2Dto: NewGuestDto = {
        name: 'guest 2',
        pin: pin,
      };

      await loadBox(client, BOX_ID);
      await joinLobby(guest1Client, guest1Dto);
      await joinLobby(guest2Client, guest2Dto);
      const response = await startGame(client, 'Who is');
      expect(response).toEqual('Who is has started');
      await endGame(client);
    });

    it('Should end a game if there is 1 player left', async () => {
      await authenticate(client);
      const { pin } = await createLobby(client);
      const guest1Client = io.connect(baseAddress);
      const guest2Client = io.connect(baseAddress);
      const guest1Dto: NewGuestDto = {
        name: 'guest 1',
        pin: pin,
      };
      const guest2Dto: NewGuestDto = {
        name: 'guest 2',
        pin: pin,
      };

      await loadBox(client, BOX_ID);
      await joinLobby(guest1Client, guest1Dto);
      await joinLobby(guest2Client, guest2Dto);
      const response = await startGame(client, 'Who is');
      expect(response).toEqual('Who is has started');

      client.on(ServerEvents.gameEvent, (gameEvent) => {
        if (gameEvent.event === ServerEvents.endGameResponse) {
          guest1Client.disconnect();
        }
      });
      guest2Client.disconnect();
    });

    it('Should throw a WsException when ending a game as a guest', async () => {
      await authenticate(client);
      const { pin } = await createLobby(client);
      const guest1Client = io.connect(baseAddress);
      const guest2Client = io.connect(baseAddress);
      const guest1Dto: NewGuestDto = {
        name: 'guest 1',
        pin: pin,
      };
      const guest2Dto: NewGuestDto = {
        name: 'guest 2',
        pin: pin,
      };

      await loadBox(client, BOX_ID);
      await joinLobby(guest1Client, guest1Dto);
      await joinLobby(guest2Client, guest2Dto);
      await startGame(client, 'Who is');
      try {
        await endGame(guest1Client);
      } catch (err) {
        expect(err.message).toEqual('Not authorized');
        guest1Client.disconnect();
      }
    });
    it('Should throw a WsException when starting with less than 2 players', async () => {
      await authenticate(client);
      const { pin } = await createLobby(client);
      const guest1Client = io.connect(baseAddress);
      const guest1Dto: NewGuestDto = {
        name: 'guest 1',
        pin: pin,
      };
      await loadBox(client, BOX_ID);
      await joinLobby(guest1Client, guest1Dto);
      try {
        await startGame(client, 'Who is');
      } catch (err) {
        expect(err.message).toEqual('Not enough players');
        guest1Client.disconnect();
      }
    });
  });

  describe('Setting Lobby Admin', () => {
    it('Should set a guest as lobby admin', async () => {
      await authenticate(client);
      const { pin } = await createLobby(client);
      const guestClient = io.connect(baseAddress);
      const guest1Dto: NewGuestDto = {
        name: 'guest 1',
        pin: pin,
      };
      await loadBox(client, BOX_ID);
      await joinLobby(guestClient, guest1Dto);

      await setLobbyAdmin(client, guestClient.id);
      client.on(ServerEvents.lobbyStatus, (lobby) => {
        if (lobby.lobbyAdmin.id) {
          expect(lobby.lobbyAdmin.id).toEqual(guestClient.id);
          guestClient.disconnect();
        }
      });
    });

    it('Should set a guest as lobby admin and the guest should start the game', async () => {
      await authenticate(client);
      const { pin } = await createLobby(client);
      const guest1Client = io.connect(baseAddress);
      const guest2Client = io.connect(baseAddress);
      const guest1Dto: NewGuestDto = {
        name: 'guest 1',
        pin: pin,
      };
      const guest2Dto: NewGuestDto = {
        name: 'guest 2',
        pin: pin,
      };

      await loadBox(client, BOX_ID);
      await joinLobby(guest1Client, guest1Dto);
      await joinLobby(guest2Client, guest2Dto);

      await setLobbyAdmin(client, guest1Client.id);

      const response = await startGame(guest1Client, 'Who is');
      expect(response).toEqual('Who is has started');
    });

    it('Should automatically set a new lobby admin when the current one disconnects', async () => {
      await authenticate(client);
      const { pin } = await createLobby(client);
      const guest1Client = io.connect(baseAddress);
      const guest2Client = io.connect(baseAddress);
      const guest1Dto: NewGuestDto = {
        name: 'guest 1',
        pin: pin,
      };
      const guest2Dto: NewGuestDto = {
        name: 'guest 2',
        pin: pin,
      };
      const setGuestAsLobbyAdmin = async (
        client: io.Socket,
        guestClientId: string,
      ) =>
        new Promise<void>((resolve, reject) => {
          client.emit(ClientEvents.setLobbyAdmin, guestClientId);
          client.once(ServerEvents.lobbyStatus, (lobby: LobbyInfoDto) => {
            if (lobby.lobbyAdmin?.id === guestClientId) resolve();
          });
          client.on(ServerEvents.exception, (error) => {
            if (error.event === ClientEvents.setLobbyAdmin) {
              reject(error);
            }
          });
        });
      await loadBox(client, BOX_ID);
      await joinLobby(guest1Client, guest1Dto);
      await joinLobby(guest2Client, guest2Dto);
      await setGuestAsLobbyAdmin(client, guest1Client.id);
      client.once(ServerEvents.lobbyStatus, (lobby: LobbyInfoDto) => {
        if (lobby.lobbyAdmin?.id === guest2Client.id) {
          expect(lobby.lobbyAdmin?.id).toEqual(guest2Client.id);
          guest2Client.disconnect();
        }
      });
      guest1Client.disconnect();
    });

    it('Should throw and WsException when setting a lobby admin as a guest without lobby admin privileges', async () => {
      await authenticate(client);
      const { pin } = await createLobby(client);
      const guest1Client = io.connect(baseAddress);
      const guest2Client = io.connect(baseAddress);
      const guest1Dto: NewGuestDto = {
        name: 'guest 1',
        pin: pin,
      };
      const guest2Dto: NewGuestDto = {
        name: 'guest 2',
        pin: pin,
      };
      await loadBox(client, BOX_ID);
      await joinLobby(guest1Client, guest1Dto);
      await joinLobby(guest1Client, guest2Dto);
      try {
        await setLobbyAdmin(guest1Client, guest2Client.id);
      } catch (err) {
        expect(err.message).toEqual('Not authorized');
        guest1Client.disconnect();
        guest2Client.disconnect();
      }
    });
  });

  describe('Guest Privileges', () => {
    it('Should throw and wsException when starting the game as a guest without lobby admin privileges', async () => {
      await authenticate(client);
      const { pin } = await createLobby(client);
      const guest1Client = io.connect(baseAddress);
      const guest2Client = io.connect(baseAddress);
      const guest1Dto: NewGuestDto = {
        name: 'guest 1',
        pin: pin,
      };
      const guest2Dto: NewGuestDto = {
        name: 'guest 2',
        pin: pin,
      };
      await loadBox(client, BOX_ID);
      await joinLobby(guest1Client, guest1Dto);
      await joinLobby(guest2Client, guest2Dto);
      await setLobbyAdmin(client, guest1Client.id);
      try {
        await startGame(guest2Client, 'Who is');
      } catch (err) {
        expect(err.message).toEqual('Not authorized');
        guest1Client.disconnect();
        guest2Client.disconnect();
      }
    });
    it('Should throw and wsException when ending the game as a guest without lobby admin privileges', async () => {
      await authenticate(client);
      const { pin } = await createLobby(client);
      const guest1Client = io.connect(baseAddress);
      const guest2Client = io.connect(baseAddress);
      const guest1Dto: NewGuestDto = {
        name: 'guest 1',
        pin: pin,
      };
      const guest2Dto: NewGuestDto = {
        name: 'guest 2',
        pin: pin,
      };
      await loadBox(client, BOX_ID);
      await joinLobby(guest1Client, guest1Dto);
      await joinLobby(guest2Client, guest2Dto);
      await setLobbyAdmin(client, guest1Client.id);
      await startGame(client, 'Who is');

      try {
        await endGame(guest2Client);
      } catch (err) {
        expect(err.message).toEqual('Not authorized');
        guest1Client.disconnect();
        guest2Client.disconnect();
      }
    });
  });
});
