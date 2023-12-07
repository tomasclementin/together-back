import { GameConfig } from '../../domain/game-config.entity';

export const GAME_CONFIG_REPOSITORY = ' GAME_CONFIG_REPOSITORY';

export interface IGameConfigRepository {
  save(gameConfig: GameConfig): Promise<GameConfig>;

  getAll(): Promise<{ gameConfigs: GameConfig[]; count: number }>;

  getById(id: number): Promise<GameConfig>;

  delete(gameConfig: GameConfig): Promise<GameConfig>;
}
