import { Player } from '@/module/game/domain/player.entity';

export class WhoIsPlayer extends Player {
  chosenOption: string;
  score: number;
  constructor(id: string, name: string) {
    super(id, name);
    this.chosenOption = '';
    this.score = 0;
  }
}
