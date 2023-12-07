import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

@Catch(HttpException)
export class WebSocketsExceptionsFilter extends BaseWsExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const wsException = new WsException(exception.message);
    super.catch(wsException, host);
  }
}
