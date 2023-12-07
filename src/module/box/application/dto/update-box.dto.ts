import { IsNumber, IsOptional } from 'class-validator';

import { CreateBoxDto } from './create-box.dto';

import { ApiProperty, PartialType } from '@nestjs/swagger';

export class UpdateBoxDto extends PartialType(CreateBoxDto) {
  @ApiProperty({
    description: 'The id of the box',
    example: 1,
    required: false,
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  id: number;
}
