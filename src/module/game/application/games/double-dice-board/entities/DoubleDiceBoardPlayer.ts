import { randomInt } from 'crypto';

import { Player } from '@/module/game/domain/player.entity';

export class DoubleDiceBoardPlayer extends Player {
  id: string;
  name: string;
  lastRolls: { row: number; column: number };
  constructor(id: string, name: string) {
    super(id, name);
    this.lastRolls = { row: 0, column: 0 };
  }

  rollDices() {
    this.lastRolls.row = randomInt(1, 6 + 1);
    this.lastRolls.column = randomInt(1, 6 + 1);
  }
}
