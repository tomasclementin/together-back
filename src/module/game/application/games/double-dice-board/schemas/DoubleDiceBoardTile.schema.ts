import { EntitySchema } from 'typeorm';

import { DoubleDiceBoardTile } from '../entities/DoubleDiceBoardTile';

export const DoubleDiceBoardTileSchema = new EntitySchema<DoubleDiceBoardTile>({
  name: 'DoubleDiceBoardTile',
  target: DoubleDiceBoardTile,
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    text: {
      type: String,
      nullable: false,
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
    gameConfigs: {
      type: 'many-to-many',
      target: 'DoubleDiceBoardConfig',
      inverseSide: 'doubleDiceBoardTiles',
    },
  },
});
