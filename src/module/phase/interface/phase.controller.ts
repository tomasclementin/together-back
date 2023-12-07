import { UpdatePhaseDto } from '../application/dto/update-phase.dto';
import { PhaseMapper } from '../application/mapper/phase.mapper';
import { PhaseService } from '../application/service/phase.service';

import {
  Body,
  Controller,
  Delete,
  Inject,
  Param,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import {
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import {
  IPhaseRepository,
  PHASE_REPOSITORY,
} from '@/module/phase/application/repository/phase.repository.interface';

@ApiHeader({
  name: 'Phase',
  description: 'Phase endpoint',
})
@ApiTags('Phase')
@Controller('phase')
export class PhaseController {
  constructor(
    @Inject(PHASE_REPOSITORY)
    private readonly repository: IPhaseRepository,
    private readonly phaseService: PhaseService,
    @Inject(PhaseMapper) private phaseMapper: PhaseMapper,
  ) {}

  @ApiOperation({ summary: 'Update phase' })
  @ApiParam({ name: 'id', description: 'Phase id' })
  @ApiOkResponse({
    description: 'Update phase correctly',
    schema: {
      properties: {
        id: {
          type: 'number',
          example: 1,
        },
        name: {
          type: 'string',
          example: 'Connect',
        },
        order: {
          type: 'number',
          example: 1,
        },
      },
    },
  })
  @Put(':id')
  async updatePhase(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePhaseDto: UpdatePhaseDto,
  ) {
    const updatePhase =
      this.phaseMapper.fromUpdatePhaseDtoToEntity(updatePhaseDto);
    return await this.phaseService.updatePhase(id, updatePhase);
  }

  @ApiOperation({ summary: 'Delete phase' })
  @ApiParam({ name: 'id', description: 'Phase id' })
  @ApiOkResponse({
    description: 'Delete phase correctly',
    schema: {
      properties: {
        name: {
          type: 'string',
          example: 'Connect',
        },
        order: {
          type: 'number',
          example: 1,
        },
      },
    },
  })
  @Delete(':id')
  async deletePhase(@Param('id', ParseIntPipe) id: number) {
    const deletedPhase = await this.phaseService.deletePhase(id);
    return deletedPhase;
  }
}
