import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class SocketAuthGuard extends AuthGuard('WebSocketJwt') {
  getRequest(context: ExecutionContext) {
    return context.switchToWs().getClient().handshake;
  }
}
