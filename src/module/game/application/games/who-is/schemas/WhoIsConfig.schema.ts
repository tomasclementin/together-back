import { EntitySchema } from 'typeorm';

import { WhoIsConfig } from '../entities/WhoIs.config';

import { GameConfigSchema } from '@/module/game-config/infrastructure/persistence/game-config.schema';

export const WhoIsConfigSchema = new EntitySchema<WhoIsConfig>({
  name: 'WhoIsConfig',
  target: WhoIsConfig,
  type: 'entity-child',
  columns: {
    ...GameConfigSchema.options.columns,
  },
  relations: {
    whoIsCards: {
      type: 'many-to-many',
      target: 'WhoIsCard',
      eager: true,
      cascade: true,
      joinTable: { name: 'who_is_cards' },
      inverseSide: 'gameConfigs',
    },
  },
});
