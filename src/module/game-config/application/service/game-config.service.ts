import { GameConfig } from '../../domain/game-config.entity';
import {
  GAME_CONFIG_REPOSITORY,
  IGameConfigRepository,
} from '../repository/game-config.repository.interface';

import { Inject, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class GameConfigService {
  constructor(
    @Inject(GAME_CONFIG_REPOSITORY)
    private gameConfigRepository: IGameConfigRepository,
  ) {}

  async createGameConfig(newGameConfig: GameConfig): Promise<GameConfig> {
    return await this.gameConfigRepository.save(newGameConfig);
  }

  async getGameConfigById(id: number): Promise<GameConfig> {
    const gameConfig = await this.gameConfigRepository.getById(id);

    if (!gameConfig) {
      throw new NotFoundException('Game config not found');
    }

    return gameConfig;
  }

  async updateGameConfig(
    id: number,
    updateGameConfig: GameConfig,
  ): Promise<GameConfig> {
    await this.getGameConfigById(id);
    updateGameConfig.id = id;
    return await this.gameConfigRepository.save(updateGameConfig);
  }

  async deleteGameConfig(id: number): Promise<GameConfig> {
    const gameConfig = await this.getGameConfigById(id);

    this.gameConfigRepository.delete(gameConfig);

    return gameConfig;
  }

  async save(gameConfig: GameConfig): Promise<GameConfig> {
    return await this.gameConfigRepository.save(gameConfig);
  }
}
