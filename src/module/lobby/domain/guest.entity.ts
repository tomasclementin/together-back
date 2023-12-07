import { Socket } from 'socket.io';

import { ServerEvents } from '../application/events/server.events';

export class Guest {
  id: string;
  name: string;
  client: Socket;

  constructor(id: string, name: string, client: Socket) {
    this.id = id;
    this.name = name;
    this.client = client;
  }
  notify(message: string) {
    this.client.emit(ServerEvents.clientNotification, message);
  }

  async join(lobbyId: string) {
    await this.client.join(lobbyId);
  }

  listen(event: string, onEvent: (guest: Guest, payload: any) => any) {
    this.client.on(event, (data) => onEvent(this, data));
  }
  removeAllListeners(event: string) {
    this.client.removeAllListeners(event);
  }

  disconnect() {
    this.client.disconnect();
  }
}
