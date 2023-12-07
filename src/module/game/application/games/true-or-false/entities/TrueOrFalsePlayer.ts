import { randomInt } from 'crypto';

import { TrueOrFalseStory } from '../enums/TrueOrFalse.enums';

import { Player } from '@/module/game/domain/player.entity';

export class TrueOrFalsePlayer extends Player {
  currentTile: number;
  lastTile: number;
  score: number;
  story: TrueOrFalseStory;
  choosenOption: TrueOrFalseStory;
  lastRoll: number;
  constructor(id: string, name: string) {
    super(id, name);
    this.currentTile = 0;
    this.lastTile = 0;
    this.story = TrueOrFalseStory.empty;
    this.score = 0;
    this.choosenOption = TrueOrFalseStory.empty;
    this.lastRoll = 0;
  }

  private generateRandomNumber(min: number, max: number) {
    return randomInt(min, max + 1);
  }

  rollDice() {
    const result = this.generateRandomNumber(1, 6);
    this.lastTile = this.currentTile;
    this.currentTile += result;
    this.lastRoll = result;
    return result;
  }

  tellTrueOrFalseStory() {
    const randomNumber = this.generateRandomNumber(1, 100);
    const percentageChance = 50;
    const trueOrFalseChance = randomNumber < percentageChance;
    if (trueOrFalseChance) {
      this.story = TrueOrFalseStory.true;
      return;
    }
    this.story = TrueOrFalseStory.false;
  }
}
