import { NewGameConfigDto } from './new-game-config.dto';

import { PartialType } from '@nestjs/swagger';

export class UpdateGameConfigDto extends PartialType(NewGameConfigDto) {}
