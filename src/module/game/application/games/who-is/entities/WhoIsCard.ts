import { WhoIsConfig } from './WhoIs.config';

import { Base } from '@/common/domain/base.entity';

export class WhoIsCard extends Base {
  gameConfigs?: WhoIsConfig[];
  text: string;
}
