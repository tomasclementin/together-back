import { Game } from '../../../domain/game.entity';
import { WrittenWishesConfig } from './entities/WrittenWishes.config';
import { WrittenWishesPlayer } from './entities/WrittenWishesPlayer';
import {
  WrittenWishesInputNames,
  WrittenWishesStates,
} from './enums/WrittenWishes.enums';
import { IWrittenWishesInput } from './interfaces/IWrittenWishesInput.interface';

import { Guest } from '@/module/lobby/domain/guest.entity';

export default class WrittenWishes extends Game {
  wishesPerPlayer: number;
  playerType: typeof WrittenWishesPlayer = WrittenWishesPlayer;
  currentState: WrittenWishesStates;
  players: Map<string, WrittenWishesPlayer>;
  constructor(gameConfig: WrittenWishesConfig) {
    super();
    super.name = gameConfig.gameName;
    super.description = 'Write together some wishes or goals';
    super.title = gameConfig.title;
    this.wishesPerPlayer = gameConfig.wishesAmount;
  }
  onStartGame(): void {
    this.currentState = WrittenWishesStates.playersWritting;
    this.players.forEach((player) => {
      player.wishes = new Array(this.wishesPerPlayer).fill('');
    });
  }

  handlePlayerInput(guest: Guest, input: IWrittenWishesInput) {
    const player = this.players.get(guest.id);
    switch (input.name) {
      case WrittenWishesInputNames.wishesInput: {
        if (
          this.currentState !== WrittenWishesStates.playersWritting &&
          !player.hasFinishedWritting
        )
          return;
        player.wishes = input.payload;
        break;
      }
      case WrittenWishesInputNames.finishWritting: {
        player.hasFinishedWritting = true;
        if (this.checkIfAllPlayersFinishedWriting()) {
          this.currentState = WrittenWishesStates.showingWishes;
        }
        break;
      }
    }
  }

  checkIfAllPlayersFinishedWriting(): boolean {
    for (const player of this.players.values()) {
      if (!player.hasFinishedWritting) {
        return false;
      }
    }
    return true;
  }
}
