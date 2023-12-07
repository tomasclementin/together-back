import { BOX_REPOSITORY } from '../box/application/repository/box.repository.interface';
import { BoxRepository } from '../box/infrastructure/persistence/box.repository';
import { GameConfigMapper } from './application/mapper/game-config.mapper';
import { GAME_CONFIG_REPOSITORY } from './application/repository/game-config.repository.interface';
import { GameConfigService } from './application/service/game-config.service';
import { GameConfigRepository } from './infrastructure/persistence/game-config.repository';
import { GameConfigSchema } from './infrastructure/persistence/game-config.schema';
import { GameConfigController } from './interface/game-config.controller';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([GameConfigSchema])],
  controllers: [GameConfigController],
  providers: [
    GameConfigService,
    GameConfigRepository,
    { provide: GAME_CONFIG_REPOSITORY, useClass: GameConfigRepository },
    GameConfigMapper,
    {
      provide: BOX_REPOSITORY,
      useClass: BoxRepository,
    },
  ],
  exports: [GameConfigService, GameConfigRepository],
})
export class GameConfigModule {}
