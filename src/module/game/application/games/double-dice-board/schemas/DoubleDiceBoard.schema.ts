import { EntitySchema } from 'typeorm';

import { DoubleDiceBoardConfig } from '../entities/DoubleDiceBoard.config';

import { GameConfigSchema } from '@/module/game-config/infrastructure/persistence/game-config.schema';

export const DoubleDiceBoardConfigSchema =
  new EntitySchema<DoubleDiceBoardConfig>({
    name: 'DoubleDiceBoardConfig',
    target: DoubleDiceBoardConfig,
    type: 'entity-child',
    columns: {
      ...GameConfigSchema.options.columns,
      doubleDiceBoardMinRounds: {
        type: Number,
        nullable: false,
      },
    },
    relations: {
      doubleDiceBoardTiles: {
        type: 'many-to-many',
        target: 'DoubleDiceBoardTile',
        eager: true,
        cascade: true,
        joinTable: { name: 'double_dice_board_tiles' },
        inverseSide: 'gameConfigs',
      },
    },
  });
