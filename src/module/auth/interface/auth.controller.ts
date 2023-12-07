import { LoginDto } from '../application/dto/login.dto';
import { SignupDto } from '../application/dto/signup.dto';
import { AuthService } from '../application/service/auth.service';

import { Body, Controller, Inject, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiHeader,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { BaseController } from '@/common/interface/base.controller';

@ApiHeader({
  name: 'Auth',
  description: 'Authentication endpoint',
})
@ApiTags('Auth')
@Controller('auth')
export class AuthController extends BaseController {
  constructor(@Inject(AuthService) private authService: AuthService) {
    super();
  }

  @ApiOperation({ summary: 'Signup' })
  @ApiCreatedResponse({ description: 'Signup correctly' })
  @ApiBody({ type: SignupDto })
  @Post('signup')
  async signup(@Body() user: SignupDto) {
    return this.authService.signup(user);
  }

  @ApiOperation({ summary: 'Login' })
  @ApiCreatedResponse({
    description: 'Login correctly',
    schema: {
      properties: {
        idToken: {
          type: 'object',
          example: {
            jwtToken: 'jwtToken',
            payload: {},
          },
        },
        refreshToken: {
          type: 'object',
          example: {
            token: 'jwtToken',
          },
        },
        accessToken: {
          type: 'object',
          example: {
            jwtToken: 'jwtToken',
            payload: {},
          },
        },
        clockDrift: {
          type: 'number',
          example: 0,
        },
      },
    },
  })
  @ApiBody({ type: LoginDto })
  @Post('login')
  async login(@Body() user: LoginDto) {
    return this.authService.login(user);
  }
}
