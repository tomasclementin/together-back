import { Socket } from 'socket.io';

import { Lobby } from '../../domain/lobby.entity';

import { User } from '@/module/user/domain/user.entity';

export type AuthenticatedSocket = Socket & {
  data: {
    lobby: null | Lobby;
    user: null | User;
  };
};
