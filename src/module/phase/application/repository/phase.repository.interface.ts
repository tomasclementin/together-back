import { Phase } from '../../domain/phase.entity';

export const PHASE_REPOSITORY = 'PHASE_REPOSITORY';

export interface IPhaseRepository {
  getAllPhases(): Promise<{ phases: Phase[]; count: number }>;

  getPhaseById(id: number): Promise<Phase>;

  savePhase(phase: Phase): Promise<Phase>;

  deletePhase(phase: Phase): Promise<Phase>;
}
