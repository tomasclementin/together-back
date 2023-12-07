import { Base } from '@/common/domain/base.entity';
import { Box } from '@/module/box/domain/box.entity';
import { GameConfig } from '@/module/game-config/domain/game-config.entity';

export class Phase extends Base {
  box: Box;
  order: number;
  name: string;
  gameConfig: GameConfig;
}
