import { User } from '@/module/user/domain/user.entity';

export const USER_REPOSITORY = 'USER_REPOSITORY';

export interface IUserQuery {
  id?: number;
  externalId?: string;
  email?: string;
}

export interface IUserRepository {
  create(user: User): Promise<User | null>;
  getAllUsers(): Promise<{ users: User[]; count: number }>;
  getUserBy(query: IUserQuery): Promise<User | null>;
  deleteUser(user: User): Promise<User>;
  saveUser(user: User): Promise<User>;
}
