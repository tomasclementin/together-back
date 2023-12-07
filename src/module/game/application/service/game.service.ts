import { DataSource } from 'typeorm';

import { Game } from '../../domain/game.entity';
import { getGameMap } from '../games/game.map';

import { Injectable } from '@nestjs/common';

import { GameConfig } from '@/module/game-config/domain/game-config.entity';

@Injectable()
export class GameService {
  games: Map<string, new (gameConfig: GameConfig) => Game> = new Map();
  constructor(private readonly dataSource: DataSource) {
    this.games = getGameMap();
  }

  async buildGame(gameConfig: GameConfig): Promise<Game> {
    const gameOptions = await this.dataSource
      .getRepository(gameConfig.configType)
      .findOne({
        where: {
          id: gameConfig.id,
        },
      });
    const game = this.games.get(gameConfig.gameName);
    return new game(gameOptions as any);
  }
}
