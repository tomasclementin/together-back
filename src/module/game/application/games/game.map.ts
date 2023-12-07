import { Game } from '../../domain/game.entity';
import { DoubleDiceBoard } from './double-dice-board/DoubleDiceBoard.game';
import { DoubleDiceBoardConfigDto } from './double-dice-board/dto/DoubleDiceBoardConfigDto';
import { DoubleDiceBoardConfig } from './double-dice-board/entities/DoubleDiceBoard.config';
import { TrueOrFalse } from './true-or-false/TrueOrFalse.game';
import { TrueOrFalseConfigDto } from './true-or-false/dto/TrueOrFalseConfigDto';
import { TrueOrFalseConfig } from './true-or-false/entities/TrueOrFalse.config';
import WhoIs from './who-is/WhoIs.game';
import { WhoIsConfigDto } from './who-is/dto/WhoIsConfig.dto';
import { WhoIsConfig } from './who-is/entities/WhoIs.config';
import WrittenWishes from './written-wishes/WrittenWishes.game';
import { WrittenWishesConfigDto } from './written-wishes/dto/WrittenWishesConfig.dto';
import { WrittenWishesConfig } from './written-wishes/entities/WrittenWishes.config';

import { GameConfig } from '@/module/game-config/domain/game-config.entity';

export const getGameMap = () => {
  const map = new Map<string, new (gameConfig: GameConfig) => Game>();
  map.set('Who is', WhoIs);
  map.set('True or false', TrueOrFalse);
  map.set('Double dice board', DoubleDiceBoard);
  map.set('Written wishes', WrittenWishes);
  return map;
};

export const getDtoMap = () => {
  const map = new Map<string, typeof GameConfig>();
  map.set('WhoIsConfig', WhoIsConfig);
  map.set('TrueOrFalseConfig', TrueOrFalseConfig);
  map.set('DoubleDiceBoardConfig', DoubleDiceBoardConfig);
  map.set('WrittenWishesConfig', WrittenWishesConfig);
  return map;
};

export const getTypeMap = () => {
  const dtoSchemaValidation = {
    keepDiscriminatorProperty: true,
    discriminator: {
      property: 'configType',
      subTypes: [
        { name: 'WhoIsConfig', value: WhoIsConfigDto },
        { name: 'TrueOrFalseConfig', value: TrueOrFalseConfigDto },
        { name: 'DoubleDiceBoardConfig', value: DoubleDiceBoardConfigDto },
        { name: 'WrittenWishesConfig', value: WrittenWishesConfigDto },
      ],
    },
  };
  return dtoSchemaValidation;
};
export type dtoTypes =
  | WhoIsConfigDto
  | TrueOrFalseConfigDto
  | DoubleDiceBoardConfigDto
  | WrittenWishesConfigDto;
