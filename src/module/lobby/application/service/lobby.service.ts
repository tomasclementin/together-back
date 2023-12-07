import { Server } from 'socket.io';

import { Guest } from '../../domain/guest.entity';
import { Host } from '../../domain/host.entity';
import { Lobby } from '../../domain/lobby.entity';
import { AuthenticatedSocket } from '../interfaces/authenticated.socket.interface';

import { Inject, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

import { BoxService } from '@/module/box/application/service/box.service';

@Injectable()
export class LobbyService {
  server: Server;
  lobbies: Map<string, Lobby>;
  constructor(@Inject(BoxService) private boxService: BoxService) {
    this.lobbies = new Map();
  }

  async createLobby(client: AuthenticatedSocket): Promise<Lobby> {
    if (!client.data.user) throw new WsException('Not authorized');

    const host = new Host(client.data.user, client);

    let pin: string;
    do {
      pin = this.generateRandomPin();
    } while (this.lobbies.has(pin));

    const lobby = new Lobby(host.client.id, this.server, host, pin);

    await lobby.initialize();

    this.lobbies.set(pin, lobby);

    client.data.lobby = lobby;

    return lobby;
  }

  private generateRandomPin(): string {
    const min = 100000;
    const max = 999999;
    return String(Math.floor(Math.random() * (max - min + 1) + min));
  }

  async joinLobby(guest: Guest, pin: string) {
    const lobby = await this.getLobbyByPin(pin);
    if (lobby.guests.size === lobby.box.maxPlayers)
      throw new WsException('Lobby is full');
    guest.client.data.lobby = lobby;
    guest.client.data.guest = guest;

    lobby.addGuest(guest);
    lobby.notify(`${guest.name} has joined`);
    guest.notify('Successfully joined');
  }

  async removeLobby(lobby: Lobby) {
    await this.getLobbyByPin(lobby.pin);
    lobby.shutDown();
    this.lobbies.delete(lobby.pin);
  }

  async getLobbyByPin(pin: string): Promise<Lobby> {
    const lobby = this.lobbies.get(pin);
    if (!lobby) throw new WsException('Lobby does not exists');
    return lobby;
  }

  async loadBox(lobby: Lobby, boxId: number) {
    const box = await this.boxService.getPlayableBoxById(boxId);
    lobby.loadBox(box);
  }
}
