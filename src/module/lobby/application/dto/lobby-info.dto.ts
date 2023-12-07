import { GuestInfoDto } from './guest-info.dto';

import { BoxInfoDto } from '@/module/box/application/dto/box-info.dto';
import { Game } from '@/module/game/domain/game.entity';

export class LobbyInfoDto {
  box: BoxInfoDto;
  guests: GuestInfoDto[];
  currentGame: Game;
  lobbyAdmin?: GuestInfoDto;
}
