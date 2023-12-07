import { Box } from '../../domain/box.entity';
import { CreateBoxDto } from '../dto/create-box.dto';
import { UpdateBoxDto } from '../dto/update-box.dto';

import { Injectable } from '@nestjs/common';

@Injectable()
export class BoxMapper {
  fromCreateBoxDtoToEntity(dto: CreateBoxDto): Box {
    const boxEntity = new Box();
    boxEntity.title = dto.title;
    boxEntity.description = dto.description;
    boxEntity.maxPlayers = dto.maxPlayers;
    return boxEntity;
  }

  fromUpdateBoxDtoToEntity(dto: UpdateBoxDto): Box {
    const boxEntity = new Box();
    boxEntity.id = dto.id;
    boxEntity.title = dto.title;
    boxEntity.description = dto.description;
    boxEntity.maxPlayers = dto.maxPlayers;
    return boxEntity;
  }
}
