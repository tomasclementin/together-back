import { EntitySchema } from 'typeorm';

import { Phase } from '../../domain/phase.entity';

export const PhaseSchema = new EntitySchema<Phase>({
  name: 'Phase',
  target: Phase,
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    order: {
      type: Number,
    },
    name: {
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
    box: {
      type: 'many-to-one',
      target: 'Box',
      inverseSide: 'phases',
      onDelete: 'CASCADE',
    },
    gameConfig: {
      type: 'one-to-one',
      target: 'GameConfig',
      joinColumn: true,
      inverseSide: 'phase',
      cascade: true,
    },
  },
});
