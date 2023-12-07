import { EntitySchema } from 'typeorm';

import { WhoIsCard } from '../entities/WhoIsCard';

export const WhoIsCardSchema = new EntitySchema<WhoIsCard>({
  name: 'WhoIsCard',
  target: WhoIsCard,
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
      target: 'WhoIsConfig',
      inverseSide: 'whoIsCards',
    },
  },
});
