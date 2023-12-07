import { WhoIsCard } from './WhoIsCard';

import { GameConfig } from '@/module/game-config/domain/game-config.entity';

export class WhoIsConfig extends GameConfig {
  whoIsCards: WhoIsCard[];
}
