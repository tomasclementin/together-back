import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';

import { DoubleDiceBoardTileDto } from './DoubleDiceBoardTile.dto';

import { GameConfigDto } from '@/module/game-config/application/dto/game-config.dto';

export class DoubleDiceBoardConfigDto extends GameConfigDto {
  @ValidateNested({ each: true })
  @Type(() => DoubleDiceBoardTileDto)
  @IsNotEmpty({ message: 'Tiles must not be empty' })
  @ArrayMinSize(36, { message: 'Tiles array must have at least 36 items' })
  @ArrayMaxSize(36, { message: 'Tiles array must have at most 36 items' })
  doubleDiceBoardTiles: DoubleDiceBoardTileDto[];

  @IsNumber()
  @IsNotEmpty()
  doubleDiceBoardMinRounds: number;
}
