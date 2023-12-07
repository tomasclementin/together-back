import { GameConfigSchema } from '../game-config/infrastructure/persistence/game-config.schema';
import { DoubleDiceBoardConfigSchema } from './application/games/double-dice-board/schemas/DoubleDiceBoard.schema';
import { DoubleDiceBoardTileSchema } from './application/games/double-dice-board/schemas/DoubleDiceBoardTile.schema';
import { TrueOrFalseConfigSchema } from './application/games/true-or-false/schemas/TrueOrFalse.schema';
import { TrueOrFalseTileSchema } from './application/games/true-or-false/schemas/TrueOrFalseTile.schema';
import { WhoIsCardSchema } from './application/games/who-is/schemas/WhoIsCard.schema';
import { WhoIsConfigSchema } from './application/games/who-is/schemas/WhoIsConfig.schema';
import { WrittenWishesConfigSchema } from './application/games/written-wishes/schemas/WrittenWishesConfig.schema';
import { GameService } from './application/service/game.service';
import { GameController } from './interface/game.controller';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GameConfigSchema,
      WhoIsConfigSchema,
      WhoIsCardSchema,
      TrueOrFalseConfigSchema,
      TrueOrFalseTileSchema,
      DoubleDiceBoardConfigSchema,
      DoubleDiceBoardTileSchema,
      WrittenWishesConfigSchema,
    ]),
  ],
  controllers: [GameController],
  providers: [GameService],
  exports: [GameService],
})
export class GameModule {}
