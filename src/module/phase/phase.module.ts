import { GameConfigModule } from '../game-config/game-config.module';
import { GameModule } from '../game/game.module';
import { PhaseMapper } from './application/mapper/phase.mapper';
import { PHASE_REPOSITORY } from './application/repository/phase.repository.interface';
import { PhaseService } from './application/service/phase.service';
import { PhaseRepository } from './infrastructure/persistence/phase.repository';
import { PhaseSchema } from './infrastructure/persistence/phase.schema';
import { PhaseController } from './interface/phase.controller';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    GameModule,
    GameConfigModule,
    TypeOrmModule.forFeature([PhaseSchema]),
  ],
  controllers: [PhaseController],
  providers: [
    {
      useClass: PhaseRepository,
      provide: PHASE_REPOSITORY,
    },
    PhaseService,
    PhaseMapper,
  ],
  exports: [PhaseService],
})
export class PhaseModule {}
