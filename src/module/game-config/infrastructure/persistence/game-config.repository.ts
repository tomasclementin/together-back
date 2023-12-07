import { DataSource, Repository } from 'typeorm';

import { IGameConfigRepository } from '../../application/repository/game-config.repository.interface';
import { GameConfig } from '../../domain/game-config.entity';

import { Injectable } from '@nestjs/common';

@Injectable()
export class GameConfigRepository implements IGameConfigRepository {
  private readonly repository: Repository<GameConfig>;

  constructor(private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(GameConfig);
  }

  async getAll(): Promise<{
    gameConfigs: GameConfig[];
    count: number;
  }> {
    const [gameConfigs, count] = await this.repository.findAndCount({
      relations: { phase: true },
    });
    return { gameConfigs, count };
  }

  async getById(id: number): Promise<GameConfig> {
    return await this.repository.findOne({
      where: { id },
      relations: {
        phase: true,
      },
    });
  }

  async delete(gameConfig: GameConfig): Promise<GameConfig> {
    return await this.repository.remove(gameConfig);
  }

  async save(gameConfig: GameConfig): Promise<GameConfig> {
    return await this.repository.save(gameConfig);
  }
}
