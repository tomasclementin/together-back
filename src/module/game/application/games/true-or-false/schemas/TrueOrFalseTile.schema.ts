import { EntitySchema } from 'typeorm';

import { TrueOrFalseTile } from '../entities/TrueOrFalseTile';

export const TrueOrFalseTileSchema = new EntitySchema<TrueOrFalseTile>({
  name: 'TrueOrFalseTile',
  target: TrueOrFalseTile,
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
      target: 'TrueOrFalseConfig',
      inverseSide: 'trueOrFalseTiles',
    },
  },
});
