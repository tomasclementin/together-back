import { UserMapper } from '../application/mapper/user.mapper';
import {
  IUserRepository,
  USER_REPOSITORY,
} from '../application/repository/user.repository.interface';
import { UserService } from '../application/service/user.service';
import { User } from '../domain/user.entity';

import { Controller, Get, Inject, Param, ParseIntPipe } from '@nestjs/common';
import {
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { BaseController } from '@/common/interface/base.controller';

@ApiHeader({
  name: 'User',
  description: 'User endpoint',
})
@ApiTags('User')
@Controller('user')
export class UserController extends BaseController {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly repository: IUserRepository,
    @Inject(UserService) private readonly userService: UserService,
    @Inject(UserMapper) private readonly userMapper: UserMapper,
  ) {
    super();
  }
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({
    description: 'Get all users correctly',
    schema: {
      properties: {
        users: {
          type: 'array',
        },
        count: {
          type: 'number',
        },
      },
    },
  })
  @Get()
  async getAllUseres(): Promise<{ users: User[]; count: number }> {
    return await this.repository.getAllUsers();
  }

  @ApiOperation({ summary: 'Get user by id' })
  @ApiParam({ name: 'id', description: 'User id' })
  @ApiOkResponse({
    description: 'Get user by id correctly',
    schema: {
      properties: {
        id: {
          type: 'number',
          example: 1,
        },
        name: {
          type: 'string',
          example: 'John',
        },
        lastName: {
          type: 'string',
          example: 'Doe',
        },
        email: {
          type: 'string',
          example: 'johndoe@me.com',
        },
        phoneNumber: {
          type: 'string',
          example: '123456789',
        },
      },
    },
  })
  @Get(':id')
  async getUserById(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return await this.userService.getById(id);
  }
}
