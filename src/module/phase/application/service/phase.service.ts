import { Phase } from '../../domain/phase.entity';
import {
  IPhaseRepository,
  PHASE_REPOSITORY,
} from '../repository/phase.repository.interface';

import { Inject, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class PhaseService {
  constructor(
    @Inject(PHASE_REPOSITORY) private phaseRepository: IPhaseRepository,
  ) {}

  async createPhase(newPhase: Phase): Promise<Phase> {
    return await this.phaseRepository.savePhase(newPhase);
  }

  async getById(id: number): Promise<Phase> {
    const phase = await this.phaseRepository.getPhaseById(id);

    if (!phase) {
      throw new NotFoundException('Phase not found');
    }

    return phase;
  }

  async updatePhase(id: number, updatePhaseDto: Phase): Promise<Phase> {
    await this.getById(id);

    updatePhaseDto.id = id;

    return this.phaseRepository.savePhase(updatePhaseDto);
  }

  async deletePhase(id: number): Promise<Phase> {
    const phase = await this.getById(id);
    return await this.phaseRepository.deletePhase(phase);
  }
}
