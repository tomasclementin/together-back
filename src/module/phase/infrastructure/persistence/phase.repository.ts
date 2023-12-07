import { DataSource, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';

import { IPhaseRepository } from '@/module/phase/application/repository/phase.repository.interface';
import { Phase } from '@/module/phase/domain/phase.entity';

@Injectable()
export class PhaseRepository implements IPhaseRepository {
  private readonly repository: Repository<Phase>;

  constructor(private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(Phase);
  }
  async getAllPhases(): Promise<{ phases: Phase[]; count: number }> {
    const [phases, count] = await this.repository.findAndCount();
    return { phases, count };
  }

  async getPhaseById(id: number): Promise<Phase> {
    const phase = await this.repository.findOne({
      where: { id },
      relations: { gameConfig: true },
    });

    return phase;
  }

  async savePhase(phase: Phase): Promise<Phase> {
    return await this.repository.save(phase);
  }
  async deletePhase(phase: Phase): Promise<Phase> {
    return await this.repository.remove(phase);
  }
}
