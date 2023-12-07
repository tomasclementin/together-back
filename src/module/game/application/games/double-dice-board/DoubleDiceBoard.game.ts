import { IInput } from '../../interfaces/IInput';
import { DoubleDiceBoardConfig } from './entities/DoubleDiceBoard.config';
import { DoubleDiceBoardPlayer } from './entities/DoubleDiceBoardPlayer';
import { DoubleDiceBoardTile } from './entities/DoubleDiceBoardTile';
import {
  DoubleDiceBoardInputNames,
  DoubleDiceBoardStates,
} from './enums/DoubleDiceBoard.enums';

import { Game } from '@/module/game/domain/game.entity';
import { Player } from '@/module/game/domain/player.entity';
import { Guest } from '@/module/lobby/domain/guest.entity';

export class DoubleDiceBoard extends Game {
  playerType: new (id: string, name: string) => Player = DoubleDiceBoardPlayer;
  turnPlayer: DoubleDiceBoardPlayer;
  players: Map<string, DoubleDiceBoardPlayer>;
  tiles: DoubleDiceBoardTile[];
  currentState: DoubleDiceBoardStates;
  minRounds: number;
  currentRound: number;

  constructor(gameConfig: DoubleDiceBoardConfig) {
    super();
    super.name = gameConfig.gameName;
    super.description =
      'Roll dices and a do what the sentence in the tile says. Finish the game whenever you want';
    this.tiles = gameConfig.doubleDiceBoardTiles;
    this.minRounds = gameConfig.doubleDiceBoardMinRounds;
  }

  onStartGame(): void {
    this.currentState = DoubleDiceBoardStates.playerDiceRoll;
    this.currentRound = 1;
    this.turnPlayer = this.players.values().next().value;
  }
  handlePlayerInput(guest: Guest, input: IInput): Promise<void> {
    const player = this.players.get(guest.id);
    switch (input.name) {
      case DoubleDiceBoardInputNames.rollDices: {
        if (
          this.currentState !== DoubleDiceBoardStates.playerDiceRoll &&
          this.turnPlayer !== player
        )
          return;

        player.rollDices();
        this.currentState = DoubleDiceBoardStates.playerTask;
        break;
      }
      case DoubleDiceBoardInputNames.endTurn: {
        if (
          this.currentState !== DoubleDiceBoardStates.playerTask &&
          this.turnPlayer !== player
        ) {
          return;
        }
        this.endTurn();
        player.lastRolls = { row: 0, column: 0 };
        break;
      }
    }
  }

  endTurn(): void {
    const playerKeys = Array.from(this.players.keys());
    const currentPlayerIndex = playerKeys.indexOf(this.turnPlayer.id);
    const nextPlayerIndex = (currentPlayerIndex + 1) % playerKeys.length;

    if (nextPlayerIndex === 0) {
      this.turnPlayer = this.players.get(playerKeys[0]);
      this.currentRound += 1;
    } else {
      const nextPlayerId = playerKeys[nextPlayerIndex];
      this.turnPlayer = this.players.get(nextPlayerId);
    }
    this.currentState = DoubleDiceBoardStates.playerDiceRoll;
  }
  onPlayerDisconnect(player: DoubleDiceBoardPlayer): void {
    if (player === this.turnPlayer) {
      this.endTurn();
    }
  }
}
