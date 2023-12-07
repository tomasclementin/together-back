import { GameConfig } from '@/module/game-config/domain/game-config.entity';

export class PhaseInfoDto {
  id: number;
  name: string;
  gameConfig: GameConfig;
}
