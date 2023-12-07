import { EntitySchema } from 'typeorm';

import { WrittenWishesConfig } from '../entities/WrittenWishes.config';

import { GameConfigSchema } from '@/module/game-config/infrastructure/persistence/game-config.schema';

export const WrittenWishesConfigSchema = new EntitySchema<WrittenWishesConfig>({
  name: 'WrittenWishesConfig',
  target: WrittenWishesConfig,
  type: 'entity-child',
  columns: {
    ...GameConfigSchema.options.columns,
    wishesAmount: {
      type: Number,
      nullable: false,
    },
  },
});
