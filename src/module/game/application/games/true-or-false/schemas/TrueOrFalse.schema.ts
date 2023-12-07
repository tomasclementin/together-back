import { EntitySchema } from 'typeorm';

import { TrueOrFalseConfig } from '../entities/TrueOrFalse.config';

import { GameConfigSchema } from '@/module/game-config/infrastructure/persistence/game-config.schema';

export const TrueOrFalseConfigSchema = new EntitySchema<TrueOrFalseConfig>({
  name: 'TrueOrFalseConfig',
  target: TrueOrFalseConfig,
  type: 'entity-child',
  columns: {
    ...GameConfigSchema.options.columns,
  },
  relations: {
    trueOrFalseTiles: {
      type: 'many-to-many',
      target: 'TrueOrFalseTile',
      eager: true,
      cascade: true,
      joinTable: { name: 'true_or_false_tiles' },
      inverseSide: 'gameConfigs',
    },
  },
});
