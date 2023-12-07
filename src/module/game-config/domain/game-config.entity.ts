import { Base } from '@/common/domain/base.entity';
import { Phase } from '@/module/phase/domain/phase.entity';

export class GameConfig extends Base {
  phase?: Phase;
  configType: string;
  gameName: string;
  title: string;
}
