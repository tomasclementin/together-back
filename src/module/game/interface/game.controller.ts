import { GameService } from '../application/service/game.service';

import { Controller } from '@nestjs/common';

import { BaseController } from '@/common/interface/base.controller';

@Controller('game')
export class GameController extends BaseController {
  constructor(private readonly gameService: GameService) {
    super();
  }
}
