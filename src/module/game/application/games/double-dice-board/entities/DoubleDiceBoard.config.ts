import { DoubleDiceBoardTile } from './DoubleDiceBoardTile';

import { GameConfig } from '@/module/game-config/domain/game-config.entity';

export class DoubleDiceBoardConfig extends GameConfig {
  doubleDiceBoardTiles: DoubleDiceBoardTile[];
  doubleDiceBoardMinRounds: number;
}
