import { Game } from '../../../domain/game.entity';
import { IInput } from '../../interfaces/IInput';
import { WhoIsConfig } from './entities/WhoIs.config';
import { WhoIsCard } from './entities/WhoIsCard';
import { WhoIsPlayer } from './entities/WhoIsPlayer';
import { WhoIsInputNames, WhoIsStates } from './enums/WhoIs.enums';
import { WhoIsEvents } from './events/WhoIs.events';
import { IWhoIsInputs } from './interfaces/IWhoIsInput.interface';

import { ServerEvents } from '@/module/lobby/application/events/server.events';
import { Guest } from '@/module/lobby/domain/guest.entity';

export default class WhoIs extends Game {
  playerType: typeof WhoIsPlayer = WhoIsPlayer;
  cards: WhoIsCard[];
  initialCard: WhoIsCard;
  currentCard: WhoIsCard;
  currentState: WhoIsStates;
  players: Map<string, WhoIsPlayer>;
  constructor(gameConfig: WhoIsConfig) {
    super();
    super.name = gameConfig.gameName;
    super.description =
      'Choose among the participants the one who fit the most with the sentence shown.';
    super.title = gameConfig.title;
    this.cards = gameConfig.whoIsCards;
  }

  onStartGame(): void {
    this.initialCard = this.cards[0];
    this.currentCard = this.cards[1];
    this.currentState = WhoIsStates.playersChoosing;
  }

  handlePlayerInput(inputEmitter: Guest, input: IWhoIsInputs) {
    switch (input.name) {
      case WhoIsInputNames.chooseCard: {
        if (this.currentState === WhoIsStates.playersChoosing) {
          const player = this.players.get(inputEmitter.id);
          const chosenPlayer = this.players.get(input.payload.playerId);
          player.chosenOption = chosenPlayer.id;
        }
        break;
      }
    }
  }
  handlePrivilegeInput(input: IInput): void {
    switch (input.name) {
      case WhoIsInputNames.nextCard: {
        if (this.currentState === WhoIsStates.revealingPlayerChoosenOption) {
          this.nextCard();
        }
      }
    }
  }

  update() {
    const allPlayersChosen = Array.from(this.players.values()).every(
      (player) => player.chosenOption !== '',
    );

    if (allPlayersChosen) {
      this.currentState = WhoIsStates.revealingPlayerChoosenOption;
      this.lobby.sendEvent(ServerEvents.gameEvent, {
        event: WhoIsEvents.revealCards,
        payload: Array.from(this.players),
      });
    }
  }

  nextCard() {
    this.players.forEach((player) => {
      const chosenPlayer = this.players.get(player.chosenOption);
      if (chosenPlayer) chosenPlayer.score += 1;
      player.chosenOption = '';
    });
    const currentIndex = this.cards.indexOf(this.currentCard);
    if (currentIndex === this.cards.length - 1) {
      this.currentState = WhoIsStates.showingScores;
      return;
    }
    const nextIndex = currentIndex + 1;
    this.currentCard = this.cards[nextIndex];
    this.currentState = WhoIsStates.playersChoosing;
  }
}
