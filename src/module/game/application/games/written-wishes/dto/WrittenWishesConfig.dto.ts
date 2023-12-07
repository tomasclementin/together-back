import { IsNotEmpty, IsNumber } from 'class-validator';

import { GameConfigDto } from '@/module/game-config/application/dto/game-config.dto';

export class WrittenWishesConfigDto extends GameConfigDto {
  @IsNumber()
  @IsNotEmpty({ message: 'Wishes amount must not be empty' })
  wishesAmount: number;
}
