import { Server } from 'socket.io';

import { GuestInfoDto } from '../application/dto/guest-info.dto';
import { LobbyInfoDto } from '../application/dto/lobby-info.dto';
import { ServerEvents } from '../application/events/server.events';
import { Guest } from './guest.entity';
import { Host } from './host.entity';

import { BoxInfoDto } from '@/module/box/application/dto/box-info.dto';
import { Box } from '@/module/box/domain/box.entity';
import { Game } from '@/module/game/domain/game.entity';

export class Lobby {
  id: string;
  server: Server;
  pin: string;
  host: Host;
  box: Box;
  currentGame: Game;
  guests: Map<string, Guest>;
  lobbyAdmin: Guest;

  constructor(id: string, server: Server, host: Host, pin: string) {
    this.id = id;
    this.server = server;
    this.host = host;
    this.pin = pin;
    this.currentGame = null;
    this.guests = new Map<string, Guest>();
  }
  async initialize() {
    await this.host.join(this.id);
  }
  async addGuest(guest: Guest) {
    await guest.join(this.id);
    this.guests.set(guest.id, guest);
    this.sendUpdate();
  }

  setLobbyAdmin(guestId: string) {
    this.lobbyAdmin = this.guests.get(guestId);
    this.notify(`${this.lobbyAdmin.name} has remote control of the lobby`);
    this.sendUpdate();
  }
  removeGuest(guest: Guest) {
    if (this.currentGame) {
      this.currentGame.disconnectPlayer(guest);
    }
    if (guest !== this.lobbyAdmin) {
      this.guests.delete(guest.id);
      this.notify(`${guest.name} has disconnected`);
      this.sendUpdate();
      return;
    }

    this.guests.delete(guest.id);
    this.notify(`${guest.name} has disconnected`);

    if (this.guests.size > 0) {
      const nextGuestId = this.guests.keys().next().value;
      this.lobbyAdmin = this.guests.get(nextGuestId);
      this.notify(`${this.lobbyAdmin.name} has remote control of the lobby`);
    } else {
      this.lobbyAdmin = null;
    }

    this.sendUpdate();
  }

  notify(message: string) {
    this.server.to(this.id).emit(ServerEvents.lobbyNotification, message);
  }

  sendUpdate() {
    this.sendEvent(ServerEvents.lobbyStatus, this.info());
  }

  sendEvent(event: ServerEvents, payload?: any) {
    this.server.to(this.id).emit(event, payload);
  }
  listen(
    event: string,
    onEvent: (inputEmitter: Guest | Host, payload: unknown) => void,
  ) {
    this.guests.forEach((guest) => guest.listen(event, onEvent));
    this.host.listen(event, onEvent);
  }
  removeAllListeners(event: string) {
    this.guests.forEach((guest) => guest.removeAllListeners(event));
    this.host.removeAllListeners(event);
  }

  async loadBox(box: Box) {
    this.box = box;
    this.sendUpdate();
  }

  async startGame(gameName: string) {
    this.currentGame = this.box.games.find((game) => game.name === gameName);
    this.currentGame.startGame(this);
  }

  endGame() {
    this.currentGame.endGame();
    this.currentGame = null;
  }

  shutDown() {
    this.sendEvent(ServerEvents.lobbyShutdown);
    this.guests.forEach((guest) => {
      guest.notify('The host has disconnected');
      guest.disconnect();
    });
  }
  info(): LobbyInfoDto {
    const { guests, box, currentGame, lobbyAdmin } = this;

    const guestInfo = Array.from(guests.values()).map((guest) => ({
      id: guest.id,
      name: guest.name,
    }));

    const boxInfo: BoxInfoDto = box
      ? {
          id: box.id,
          title: box.title,
          description: box.description,
          phases: box.phases.map((phase) => {
            return {
              id: phase.id,
              name: phase.name,
              order: phase.order,
              gameConfig: phase.gameConfig,
            };
          }),
        }
      : undefined;

    const adminInfo: GuestInfoDto = lobbyAdmin
      ? {
          id: lobbyAdmin.id,
          name: lobbyAdmin.name,
        }
      : undefined;

    const gameInfo = currentGame ? currentGame.info() : undefined;
    return {
      box: boxInfo,
      guests: guestInfo,
      lobbyAdmin: adminInfo,
      currentGame: gameInfo,
    };
  }
}
