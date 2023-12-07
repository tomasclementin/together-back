import { GameConfigModule } from '../game-config/game-config.module';
import { GameModule } from '../game/game.module';
import { PhaseModule } from '../phase/phase.module';
import { BoxMapper } from './application/mapper/box.mapper';
import { BoxService } from './application/service/box.service';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BOX_REPOSITORY } from '@/module/box/application/repository/box.repository.interface';
import { BoxRepository } from '@/module/box/infrastructure/persistence/box.repository';
import { BoxSchema } from '@/module/box/infrastructure/persistence/box.schema';
import { BoxController } from '@/module/box/interface/box.controller';

@Module({
  imports: [
    GameModule,
    GameConfigModule,
    PhaseModule,
    TypeOrmModule.forFeature([BoxSchema]),
  ],
  controllers: [BoxController],
  providers: [
    {
      useClass: BoxRepository,
      provide: BOX_REPOSITORY,
    },
    BoxService,
    BoxMapper,
  ],
  exports: [BoxService],
})
export class BoxModule {}
