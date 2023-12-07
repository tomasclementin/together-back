import { TrueOrFalseConfig } from './entities/TrueOrFalse.config';
import { TrueOrFalsePlayer } from './entities/TrueOrFalsePlayer';
import { TrueOrFalseTile } from './entities/TrueOrFalseTile';
import {
  TrueOrFalseInputNames,
  TrueOrFalseStates,
  TrueOrFalseStory,
} from './enums/TrueOrFalse.enums';
import { ITrueOrFalseInput } from './interfaces/ITrueOrFalseInput.interface';

import { Game } from '@/module/game/domain/game.entity';
import { Guest } from '@/module/lobby/domain/guest.entity';

export class TrueOrFalse extends Game {
  playerType: typeof TrueOrFalsePlayer = TrueOrFalsePlayer;
  currentState: TrueOrFalseStates;
  turnPlayer: TrueOrFalsePlayer;
  isLastRound: boolean;
  tiles: TrueOrFalseTile[];
  players: Map<string, TrueOrFalsePlayer>;

  constructor(gameConfig: TrueOrFalseConfig) {
    super();
    super.name = gameConfig.gameName;
    super.description =
      'Roll the dice and tell a story about the sentence in the tile. You must tell a lie or a truth depending on the prompt of your screen.';
    this.tiles = gameConfig.trueOrFalseTiles;

    this.tiles.unshift({ text: 'Start' });
    this.tiles.push({ text: 'End' });
    this.tiles = gameConfig.trueOrFalseTiles;
  }

  onStartGame(): void {
    this.isLastRound = false;
    this.currentState = TrueOrFalseStates.playerDiceRoll;
    this.turnPlayer = this.players.values().next().value;
  }

  handlePlayerInput(guest: Guest, input: ITrueOrFalseInput): Promise<void> {
    const player = this.players.get(guest.id);
    switch (input.name) {
      case TrueOrFalseInputNames.rollDice: {
        if (
          this.currentState !== TrueOrFalseStates.playerDiceRoll &&
          this.turnPlayer !== player
        )
          return;
        player.rollDice();
        if (this.checkIfReachedEnd()) {
          this.currentState = TrueOrFalseStates.waitingForEndTurn;
          return;
        }
        player.tellTrueOrFalseStory();
        this.currentState = TrueOrFalseStates.playerStory;
        break;
      }
      case TrueOrFalseInputNames.endTurn: {
        if (
          this.currentState !== TrueOrFalseStates.playerStory &&
          this.turnPlayer !== player
        )
          return;
        if (
          this.currentState === TrueOrFalseStates.waitingForEndTurn &&
          this.isLastRound
        ) {
          this.setNextPlayer();
          return;
        }
        if (!this.checkAllPlayersChosenOption()) {
          this.notifyLobbyForEachUnchosenPlayers();
          return;
        }

        this.endTurn();
        break;
      }
      case TrueOrFalseInputNames.selectTrueOrFalseOption: {
        if (this.currentState !== TrueOrFalseStates.playerStory) return;
        player.choosenOption = input.payload;
        break;
      }
    }
  }

  setNextPlayer() {
    const playerKeys = Array.from(this.players.keys());
    const currentPlayerIndex = playerKeys.indexOf(this.turnPlayer.id);
    const nextPlayerIndex = (currentPlayerIndex + 1) % playerKeys.length;

    if (nextPlayerIndex === 0) {
      if (this.isLastRound) {
        this.currentState = TrueOrFalseStates.showingScores;
        return;
      }
      this.turnPlayer = this.players.get(playerKeys[0]);
    } else {
      const nextPlayerId = playerKeys[nextPlayerIndex];
      this.turnPlayer = this.players.get(nextPlayerId);
    }

    this.currentState = TrueOrFalseStates.playerDiceRoll;
    this.turnPlayer.lastRoll = 0;
    this.turnPlayer.story = TrueOrFalseStory.empty;
  }

  calculateScores() {
    this.players.forEach((player) => {
      if (player.choosenOption === this.turnPlayer.story) {
        player.score += 1;
      }
    });

    const allPlayersFailed = Array.from(this.players.values()).every(
      (player) => {
        const hasPlayerFail = player.choosenOption !== this.turnPlayer.story;
        player.choosenOption = TrueOrFalseStory.empty;
        return hasPlayerFail;
      },
    );

    if (allPlayersFailed) {
      this.players.forEach((player) => {
        if (player.id === this.turnPlayer.id) {
          player.score += 1;
        }
      });
    }
  }

  endTurn() {
    this.calculateScores();
    this.setNextPlayer();
  }

  checkAllPlayersChosenOption(): boolean {
    const bool = Array.from(this.players.values()).every((player) => {
      if (player === this.turnPlayer) {
        return true;
      }
      return player.choosenOption !== TrueOrFalseStory.empty;
    });
    return bool;
  }

  checkIfReachedEnd() {
    const { currentTile } = this.turnPlayer;
    const lastTileIndex = this.tiles.length - 1;

    if (currentTile < lastTileIndex) return false;
    this.turnPlayer.currentTile = lastTileIndex;
    if (this.isLastRound) {
      this.turnPlayer.score += 2;
    } else {
      this.turnPlayer.score += 3;
      this.isLastRound = true;
    }
    return true;
  }

  notifyLobbyForEachUnchosenPlayers(): void {
    const playersNotChosen = [];

    Array.from(this.players.values()).forEach((player) => {
      if (player === this.turnPlayer) return;
      if (player.choosenOption === TrueOrFalseStory.empty) {
        playersNotChosen.push(player.name);
      }
    });

    playersNotChosen.forEach((player) => {
      this.lobby.notify(`Waiting for ${player}'s choice to continue`);
    });
  }

  onPlayerDisconnect(player: TrueOrFalsePlayer): void {
    if (player === this.turnPlayer) {
      this.setNextPlayer();
    }
  }
}
