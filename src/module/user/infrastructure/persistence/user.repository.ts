import { DataSource, Repository } from 'typeorm';

import {
  IUserQuery,
  IUserRepository,
} from '../../application/repository/user.repository.interface';
import { User } from '../../domain/user.entity';

import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository implements IUserRepository {
  private readonly repository: Repository<User>;

  constructor(private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(User);
  }
  async getAllUsers(): Promise<{ users: User[]; count: number }> {
    const [users, count] = await this.repository.findAndCount();
    return { users, count };
  }

  async deleteUser(user: User): Promise<User> {
    return await this.repository.remove(user);
  }

  async create(user: User): Promise<User> {
    return await this.repository.save(user);
  }

  async saveUser(user: User): Promise<User> {
    return await this.repository.save(user);
  }

  async getUserBy(query: IUserQuery): Promise<User | null> {
    return await this.repository.findOne({ where: query });
  }
}
