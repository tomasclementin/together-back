import { NewGameConfigDto } from '../application/dto/new-game-config.dto';
import { UpdateGameConfigDto } from '../application/dto/update-game-config.dto';
import { GameConfigMapper } from '../application/mapper/game-config.mapper';
import {
  GAME_CONFIG_REPOSITORY,
  IGameConfigRepository,
} from '../application/repository/game-config.repository.interface';
import { GameConfigService } from '../application/service/game-config.service';
import { GameConfig } from '../domain/game-config.entity';
import { gameConfigResponseSchema } from './documentation/game-config-response-schemas';

import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { BaseController } from '@/common/interface/base.controller';

@ApiHeader({
  name: 'GameConfig',
  description: 'GameConfig endpoint',
})
@ApiTags('GameConfig')
@Controller('game-config')
export class GameConfigController extends BaseController {
  constructor(
    @Inject(GAME_CONFIG_REPOSITORY)
    private gameConfigRepository: IGameConfigRepository,
    private readonly gameConfigService: GameConfigService,
    @Inject(GameConfigMapper) private gameConfigMapper: GameConfigMapper,
  ) {
    super();
  }
  @ApiOperation({ summary: 'Create game config' })
  @ApiCreatedResponse({ description: 'Create game config correctly' })
  @ApiBody({ type: NewGameConfigDto })
  @Post()
  createGameConfig(@Body() newGameConfigDto: NewGameConfigDto) {
    return this.gameConfigService.createGameConfig(
      this.gameConfigMapper.fromGameConfigDtoToEntity(newGameConfigDto),
    );
  }

  @ApiOperation({ summary: 'Get all game configs' })
  @ApiOkResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        gameConfigs: {
          type: 'array',
          example: [
            {
              id: 5,
              wishesAmount: 3,
              configType: 'WrittenWishesConfig',
              gameName: 'Written wishes',
              title: 'Written wishes test 2',
            },
          ],
        },
        count: {
          example: 1,
          type: 'number',
        },
      },
    },
    description: 'Get all boxes correctly',
  })
  @Get()
  findAllGamesConfig(): Promise<{ gameConfigs: GameConfig[]; count: number }> {
    return this.gameConfigRepository.getAll();
  }

  @ApiOperation({ summary: 'Get game config by id' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOkResponse({
    status: 200,
    schema: gameConfigResponseSchema,
    description: 'Get game config by id correctly',
  })
  @Get(':id')
  getGameById(@Param('id', ParseIntPipe) id: number) {
    return this.gameConfigService.getGameConfigById(id);
  }

  @ApiOperation({ summary: 'Update game config by id' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOkResponse({
    status: 200,
    schema: gameConfigResponseSchema,
    description: 'Update game config by id correctly',
  })
  @Put(':id')
  updateGameConfig(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGameConfigDto: UpdateGameConfigDto,
  ) {
    const updateGameConfig =
      this.gameConfigMapper.fromGameConfigDtoToEntity(updateGameConfigDto);
    return this.gameConfigService.updateGameConfig(id, updateGameConfig);
  }

  @ApiOperation({ summary: 'Delete game config by id' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOkResponse({
    status: 200,
    description: 'Delete box by id correctly',
    schema: {
      type: gameConfigResponseSchema.type,
      properties: { ...gameConfigResponseSchema.properties, id: undefined },
    },
  })
  @Delete(':id')
  deleteGameConfig(@Param('id', ParseIntPipe) id: number) {
    return this.gameConfigService.deleteGameConfig(id);
  }
}
