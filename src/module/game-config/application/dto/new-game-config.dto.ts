import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { GameConfigDto } from './game-config.dto';

import { ApiProperty } from '@nestjs/swagger';

import { dtoTypes, getTypeMap } from '@/module/game/application/games/game.map';
import { WhoIsConfigDto } from '@/module/game/application/games/who-is/dto/WhoIsConfig.dto';

export class NewGameConfigDto {
  @ApiProperty({
    description: 'The new config of the desired game',
    example: {
      configType: 'WhoIsConfig',
      gameName: 'Who is',
      title: 'Who is...',
      whoIsCards: [],
    } as WhoIsConfigDto,
    required: true,
    type: GameConfigDto,
  })
  @ValidateNested()
  @Type(() => GameConfigDto, getTypeMap())
  config: dtoTypes;
}
