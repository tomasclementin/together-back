import { BoxModule } from '../box/box.module';
import { UserModule } from '../user/user.module';
import { JwtSocketStrategy } from './application/guard/jwt.socket.strategy';
import { LobbyService } from './application/service/lobby.service';
import { LobbyEvents } from './interface/lobby.event.handler';

import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    BoxModule,
    UserModule,
    PassportModule.register({ defaultStrategy: 'WebSocketJwt' }),
  ],
  providers: [LobbyService, LobbyEvents, JwtSocketStrategy],
})
export class LobbyModule {}
