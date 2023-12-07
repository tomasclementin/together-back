import { AddGameToBoxDto } from '../application/dto/add-game-to-box.dto';
import { CreateBoxDto } from '../application/dto/create-box.dto';
import { UpdateBoxDto } from '../application/dto/update-box.dto';
import { BoxMapper } from '../application/mapper/box.mapper';
import { BoxService } from '../application/service/box.service';
import { Box } from '../domain/box.entity';

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
import {
  BOX_REPOSITORY,
  IBoxRepository,
} from '@/module/box/application/repository/box.repository.interface';

@ApiHeader({
  name: 'Box',
  description: 'Box endpoint',
})
@ApiTags('Box')
@Controller('box')
export class BoxController extends BaseController {
  constructor(
    @Inject(BOX_REPOSITORY)
    private readonly repository: IBoxRepository,
    private readonly boxService: BoxService,
    @Inject(BoxMapper) private boxMapper: BoxMapper,
  ) {
    super();
  }

  @ApiOperation({ summary: 'Create box' })
  @ApiCreatedResponse({ description: 'Create box correctly' })
  @ApiBody({
    type: CreateBoxDto,
  })
  @Post()
  async createBox(@Body() createBoxDto: CreateBoxDto) {
    const newBox = this.boxMapper.fromCreateBoxDtoToEntity(createBoxDto);
    return await this.boxService.createBox(newBox);
  }

  @ApiOperation({ summary: 'Get all boxes' })
  @ApiOkResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        boxes: {
          type: 'array',
          example: [
            {
              id: 1,
              title: 'Box title',
              description: 'Box description',
              phases: [],
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
  async getAllBoxes(): Promise<{ boxes: Box[]; count: number }> {
    return await this.repository.getAllBoxes();
  }

  @ApiOperation({ summary: 'Get box by id' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOkResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        box: {
          type: 'object',
          example: {
            id: 1,
            title: 'Box title',
            description: 'Box description',
            phases: [],
          },
        },
      },
    },
    description: 'Get box by id correctly',
  })
  @Get(':id')
  async getBoxById(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return await this.boxService.getById(id);
  }
  @ApiOperation({ summary: 'Update box by id' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOkResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        box: {
          type: 'object',
          example: {
            id: 1,
            title: 'Box title',
            description: 'Box description',
            phases: [],
          },
        },
      },
    },
    description: 'Update box by id correctly',
  })
  @Put(':id')
  async updateBox(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBoxDto: UpdateBoxDto,
  ) {
    const newBox = this.boxMapper.fromUpdateBoxDtoToEntity(updateBoxDto);
    return await this.boxService.updateBox(id, newBox);
  }

  @ApiOperation({ summary: 'Delete box by id' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOkResponse({
    status: 200,
    description: 'Delete box by id correctly',
    schema: {
      type: 'object',
      properties: {
        box: {
          type: 'object',
          example: {
            title: 'Box title',
            description: 'Box description',
            phases: [],
          },
        },
      },
    },
  })
  @Delete(':id')
  async deleteBox(@Param('id', ParseIntPipe) id: number) {
    const deletedBox = await this.boxService.deleteBox(id);
    return deletedBox;
  }

  @ApiOperation({
    summary: 'Add game config to box',
  })
  @ApiCreatedResponse({
    description: 'Add game config to box correctly',
  })
  @ApiBody({
    type: AddGameToBoxDto,
  })
  @Post('/:boxId/game-config')
  async addGameConfigToBox(
    @Body() payload: AddGameToBoxDto,
    @Param('boxId', ParseIntPipe) boxId: number,
  ) {
    return await this.boxService.addGameConfigToBox(
      boxId,
      payload.configId,
      payload.phaseName,
      payload.phaseOrder,
    );
  }

  @ApiOperation({
    summary: 'Delete game config from box',
  })
  @ApiParam({
    name: 'boxId',
    type: Number,
    example: 1,
  })
  @ApiOkResponse({
    description: 'Delete game config from box correctly',
  })
  @Delete('/:boxId/game-config')
  async deleteGameConfigFromBox(
    @Body() config: { configId: number },
    @Param('boxId', ParseIntPipe) boxId: number,
  ) {
    return await this.boxService.deleteGameFromBox(boxId, config.configId);
  }
}
