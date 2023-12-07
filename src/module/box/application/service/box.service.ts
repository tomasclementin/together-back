import { Box } from '../../domain/box.entity';
import {
  BOX_REPOSITORY,
  IBoxRepository,
} from '../repository/box.repository.interface';

import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { GameConfigService } from '@/module/game-config/application/service/game-config.service';
import { GameService } from '@/module/game/application/service/game.service';
import { PhaseService } from '@/module/phase/application/service/phase.service';
import { Phase } from '@/module/phase/domain/phase.entity';

@Injectable()
export class BoxService {
  constructor(
    @Inject(BOX_REPOSITORY) private boxRepository: IBoxRepository,
    @Inject(PhaseService) private phaseService: PhaseService,
    @Inject(GameService) private gameService: GameService,
    @Inject(GameConfigService) private gameConfigService: GameConfigService,
  ) {}
  async getPlayableBoxById(boxId: number) {
    const box = await this.getById(boxId);
    const gameInstances = await Promise.all(
      box.phases.map(
        async (phase: Phase) =>
          await this.gameService.buildGame(phase.gameConfig),
      ),
    );
    box.games = gameInstances;
    return box;
  }
  async createBox(newBox: Box): Promise<Box> {
    return await this.boxRepository.saveBox(newBox);
  }

  async getById(id: number): Promise<Box> {
    const box = await this.boxRepository.getBoxById(id);

    if (!box) {
      throw new NotFoundException('Box not found');
    }

    return box;
  }

  async updateBox(id: number, updateBoxDto: Box): Promise<Box> {
    await this.getById(id);

    updateBoxDto.id = id;

    return this.boxRepository.saveBox(updateBoxDto);
  }

  async deleteBox(id: number): Promise<Box> {
    const box = await this.getById(id);
    return await this.boxRepository.deleteBox(box);
  }

  async addGameConfigToBox(
    boxId: number,
    gameConfigId: number,
    phaseName: string,
    phaseOrder: number,
  ): Promise<Box> {
    const box = await this.getById(boxId);
    const gameConfig = await this.gameConfigService.getGameConfigById(
      gameConfigId,
    );

    const isAnotherPhaseInSameOrder = box.phases.find(
      (phase) => phase.order === phaseOrder,
    );

    if (isAnotherPhaseInSameOrder) {
      throw new BadRequestException(
        'The box already have a phase with this order number',
      );
    }

    const isGameConfigAdded = box.phases.some(
      (phase) => phase.gameConfig.id === gameConfig.id,
    );
    if (isGameConfigAdded || gameConfig.phase) {
      throw new BadRequestException(
        'The game config has already been added to a box',
      );
    }

    const newPhase = new Phase();
    newPhase.name = phaseName;
    newPhase.order = phaseOrder;
    newPhase.gameConfig = gameConfig;
    box.phases.push(newPhase);
    return await this.boxRepository.saveBox(box);
  }
  async deleteGameFromBox(boxId: number, gameConfigId: number): Promise<Box> {
    const box = await this.getById(boxId);
    const gameConfig = await this.gameConfigService.getGameConfigById(
      gameConfigId,
    );
    const gameConfigExistsInBox = box.phases.find(
      (phase) => phase.gameConfig.id === gameConfig.id,
    );
    if (!gameConfigExistsInBox) {
      throw new NotFoundException(
        'The game config does not exist in the box or has already been deleted',
      );
    }
    box.phases = box.phases.filter(
      (phase) => phase.gameConfig.id !== gameConfig.id,
    );
    await this.phaseService.deletePhase(gameConfig.phase.id);
    return box;
  }
}
