import { DataSource, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';

import { IBoxRepository } from '@/module/box/application/repository/box.repository.interface';
import { Box } from '@/module/box/domain/box.entity';

@Injectable()
export class BoxRepository implements IBoxRepository {
  private readonly repository: Repository<Box>;

  constructor(private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Box);
  }

  async getAllBoxes(): Promise<{ boxes: Box[]; count: number }> {
    const [boxes, count] = await this.repository.findAndCount({
      relations: { phases: true },
    });
    return { boxes, count };
  }

  async getBoxById(id: number): Promise<Box> {
    const box = await this.repository.findOne({
      where: { id },
      relations: { phases: { gameConfig: true } },
    });

    return box;
  }

  async saveBox(box: Box): Promise<Box> {
    return await this.repository.save(box);
  }
  async deleteBox(box: Box): Promise<Box> {
    return await this.repository.remove(box);
  }
}
