import { EntitySchema } from 'typeorm';

import { GameConfig } from '../../domain/game-config.entity';

export const GameConfigSchema = new EntitySchema<GameConfig>({
  name: 'GameConfig',
  target: GameConfig,
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    configType: {
      type: String,
    },
    gameName: {
      type: String,
    },
    title: {
      type: String,
    },
    createdAt: {
      type: Date,
      createDate: true,
    },
    updatedAt: {
      type: Date,
      updateDate: true,
    },
    deletedAt: {
      type: Date,
      deleteDate: true,
    },
  },
  relations: {
    phase: {
      type: 'one-to-one',
      target: 'Phase',
      inverseSide: 'gameConfig',
      onDelete: 'SET NULL',
    },
  },
  inheritance: {
    pattern: 'STI',
    column: 'configType',
  },
});
