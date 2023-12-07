import { Phase } from '../../domain/phase.entity';
import { CreatePhaseDto } from '../dto/create-phase.dto';
import { UpdatePhaseDto } from '../dto/update-phase.dto';

import { Injectable } from '@nestjs/common';

@Injectable()
export class PhaseMapper {
  fromCreatePhaseDtoToEntity(dto: CreatePhaseDto): Phase {
    const phaseEntity = new Phase();
    phaseEntity.name = dto.name;
    return phaseEntity;
  }

  fromUpdatePhaseDtoToEntity(dto: UpdatePhaseDto): Phase {
    const phaseEntity = new Phase();
    phaseEntity.id = dto.id;
    phaseEntity.name = dto.name;
    return phaseEntity;
  }
}
