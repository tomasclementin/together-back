import { EntitySchema } from 'typeorm';

import { User } from '@/module/user/domain/user.entity';

export const UserSchema = new EntitySchema<User>({
  name: 'User',
  target: User,
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    externalId: {
      type: String,
      nullable: false,
      unique: true,
    },
    email: {
      type: String,
      nullable: false,
      unique: true,
    },
    name: {
      type: String,
      nullable: false,
    },
    lastName: {
      type: String,
      nullable: false,
    },
    phoneNumber: {
      type: Number,
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
});
