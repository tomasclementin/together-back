import { Player } from '@/module/game/domain/player.entity';

export class WrittenWishesPlayer extends Player {
  wishes: string[] = [];
  hasFinishedWritting = false;
  constructor(id: string, name: string) {
    super(id, name);
  }
}
