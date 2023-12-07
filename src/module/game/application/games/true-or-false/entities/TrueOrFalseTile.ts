import { TrueOrFalseConfig } from './TrueOrFalse.config';

import { Base } from '@/common/domain/base.entity';

export class TrueOrFalseTile extends Base {
  gameConfigs?: TrueOrFalseConfig[];
  text: string;
}
