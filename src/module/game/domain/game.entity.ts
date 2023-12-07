import { IInput } from '../application/interfaces/IInput';
import { Player } from './player.entity';

import { ClientEvents } from '@/module/lobby/application/events/client.events';
import { ServerEvents } from '@/module/lobby/application/events/server.events';
import { Guest } from '@/module/lobby/domain/guest.entity';
import { Host } from '@/module/lobby/domain/host.entity';
import { Lobby } from '@/module/lobby/domain/lobby.entity';

export abstract class Game {
  title: string;
  name: string;
  description: string;
  lobby: Lobby;
  abstract playerType: new (id: string, name: string) => Player;
  abstract players: Map<string, Player>;

  async startGame(lobby: Lobby) {
    this.lobby = lobby;
    this.createPlayers(this.playerType);
    this.lobby.listen(ClientEvents.inputEvent, this.onInputEvent.bind(this));
    this.onStartGame && this.onStartGame();
    this.lobby.sendUpdate();
  }
  onStartGame?(): void;
  onEndGame?(): void;
  update?(): void;

  private createPlayers(playerType: typeof Player): void {
    this.players = new Map();
    this.lobby.guests.forEach((guest) => {
      this.players.set(guest.id, new playerType(guest.id, guest.name));
    });
  }
  private onInputEvent(inputEmitter: Guest | Host, input: IInput): void {
    if (inputEmitter instanceof Guest) {
      this.handlePlayerInput(inputEmitter, input);
    }
    if (
      inputEmitter.id === this.lobby.lobbyAdmin?.id ||
      inputEmitter.id === this.lobby.host.id
    ) {
      this.handlePrivilegeInput && this.handlePrivilegeInput(input);
    }
    this.update && this.update();
    this.lobby.sendUpdate();
  }

  abstract handlePlayerInput(inputEmitter: Guest, input: IInput): void;
  handlePrivilegeInput?(input: IInput): void;
  async endGame(): Promise<void> {
    this.lobby.sendEvent(ServerEvents.gameEvent, {
      event: ServerEvents.endGameResponse,
    });
    this.lobby.removeAllListeners(ClientEvents.inputEvent);
    this.onEndGame && this.onEndGame();
  }

  disconnectPlayer(guest: Guest): void {
    const player = this.players.get(guest.id);
    this.onPlayerDisconnect && this.onPlayerDisconnect(player);
    this.players.delete(guest.id);
    if (this.players.size === 1) {
      this.endGame();
      return;
    }
  }

  onPlayerDisconnect?(player: Player): void;

  info() {
    const gameInfo = {
      ...this,
      players: Array.from(this.players.values()),
      lobby: undefined,
    };
    return gameInfo;
  }
}
