import { Base } from '@/common/domain/base.entity';
import { Game } from '@/module/game/domain/game.entity';
import { Phase } from '@/module/phase/domain/phase.entity';

export class Box extends Base {
  title: string;
  description: string;
  maxPlayers: number;
  phases: Phase[];
  games?: Game[];
}
