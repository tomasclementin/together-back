import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';

import { WhoIsCardDto } from './WhoIsCard.dto';

import { GameConfigDto } from '@/module/game-config/application/dto/game-config.dto';

export class WhoIsConfigDto extends GameConfigDto {
  @ValidateNested({ each: true })
  @Type(() => WhoIsCardDto)
  @IsNotEmpty({ message: 'Cards must not be empty' })
  whoIsCards: WhoIsCardDto[];
}
