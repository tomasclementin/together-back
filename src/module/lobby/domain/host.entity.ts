import { Socket } from 'socket.io';

import { User } from '@/module/user/domain/user.entity';

export class Host {
  id: string;
  user: User;
  client: Socket;

  constructor(user: User, client: Socket) {
    this.user = user;
    this.client = client;
    this.id = client.id;
  }

  async join(lobbyId: string) {
    await this.client.join(lobbyId);
  }
  listen(event: string, onEvent: (host: Host, payload: any) => any) {
    this.client.on(event, (data) => onEvent(this, data));
  }
  removeAllListeners(event: string) {
    this.client.removeAllListeners(event);
  }
}
