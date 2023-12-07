import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';

import { TrueOrFalseTileDto } from './TrueOrFalseTile.dto';

import { GameConfigDto } from '@/module/game-config/application/dto/game-config.dto';

export class TrueOrFalseConfigDto extends GameConfigDto {
  @ValidateNested({ each: true })
  @Type(() => TrueOrFalseTileDto)
  @IsNotEmpty({ message: 'Tiles must not be empty' })
  trueOrFalseTiles: TrueOrFalseTileDto[];
}
