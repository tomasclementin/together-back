import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

@Catch(WsException, HttpException)
class AttachEventToWsException extends BaseWsExceptionFilter {
  constructor(private event: string) {
    super();
  }

  catch(exception: WsException | HttpException, host: ArgumentsHost) {
    let error: any;
    if (exception instanceof WsException) {
      error = exception.getError();
    } else if (exception instanceof HttpException) {
      error = exception.getResponse();
    }

    if (typeof error === 'string') {
      error = { message: error };
    }

    error.event = this.event;

    const wsException = new WsException(error);
    super.catch(wsException, host);
  }
}

export const AttachEventName = (event: string) => {
  const instance = new AttachEventToWsException(event);
  return instance;
};
