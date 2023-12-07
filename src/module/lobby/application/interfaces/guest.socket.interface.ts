import { Socket } from 'socket.io';

import { Guest } from '../../domain/guest.entity';
import { Lobby } from '../../domain/lobby.entity';

export type GuestSocket = Socket & {
  data: {
    lobby: null | Lobby;
    guest: null | Guest;
  };
};
