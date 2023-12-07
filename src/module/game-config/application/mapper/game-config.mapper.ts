import { GameConfig } from '../../domain/game-config.entity';
import { NewGameConfigDto } from '../dto/new-game-config.dto';
import { UpdateGameConfigDto } from '../dto/update-game-config.dto';

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { getDtoMap } from '@/module/game/application/games/game.map';

@Injectable()
export class GameConfigMapper {
  fromGameConfigDtoToEntity(
    dto: NewGameConfigDto | UpdateGameConfigDto,
  ): GameConfig {
    const configTypeConstructor = getDtoMap().get(dto.config.configType);
    if (!configTypeConstructor)
      throw new HttpException(
        'Game Type does not exist',
        HttpStatus.BAD_REQUEST,
      );

    return dto.config as unknown as GameConfig;
  }
}
