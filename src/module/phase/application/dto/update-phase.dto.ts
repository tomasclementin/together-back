import { IsNumber, IsOptional } from 'class-validator';

import { CreatePhaseDto } from './create-phase.dto';

import { ApiProperty, PartialType } from '@nestjs/swagger';

export class UpdatePhaseDto extends PartialType(CreatePhaseDto) {
  @ApiProperty({
    description: 'The id of the phase',
    example: 2,
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsNumber()
  id: number;
}
