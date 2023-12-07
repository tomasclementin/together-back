import { TrueOrFalseTile } from './TrueOrFalseTile';

import { GameConfig } from '@/module/game-config/domain/game-config.entity';

export class TrueOrFalseConfig extends GameConfig {
  trueOrFalseTiles: TrueOrFalseTile[];
}
