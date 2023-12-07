import { EntitySchema } from 'typeorm';

import { Box } from '../../domain/box.entity';

export const BoxSchema = new EntitySchema<Box>({
  name: 'Box',
  target: Box,
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    maxPlayers: {
      type: Number,
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
    phases: {
      type: 'one-to-many',
      target: 'Phase',
      inverseSide: 'box',
      cascade: true,
    },
  },
});
