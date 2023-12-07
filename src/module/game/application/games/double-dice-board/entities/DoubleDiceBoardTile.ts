import { DoubleDiceBoardConfig } from './DoubleDiceBoard.config';

import { Base } from '@/common/domain/base.entity';

export class DoubleDiceBoardTile extends Base {
  gameConfigs?: DoubleDiceBoardConfig[];
  text: string;
}
