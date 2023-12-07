import { Server, Socket } from 'socket.io';

import { NewGuestDto } from '../application/dto/new-guest.dto';
import { AttachEventName } from '../application/error/event.attacher';
import { WebSocketsExceptionsFilter } from '../application/error/socket.exception.filter';
import { SocketValidationPipe } from '../application/error/socket.exception.handler';
import { ClientEvents } from '../application/events/client.events';
import { ServerEvents } from '../application/events/server.events';
import { SocketAuthGuard } from '../application/guard/socket.guard';
import { AuthenticatedSocket } from '../application/interfaces/authenticated.socket.interface';
import { GuestSocket } from '../application/interfaces/guest.socket.interface';
import { LobbyService } from '../application/service/lobby.service';
import { Guest } from '../domain/guest.entity';

import { Inject, UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';

import { User } from '@/module/user/domain/user.entity';

@UseFilters(WebSocketsExceptionsFilter)
@UsePipes(new SocketValidationPipe())
@WebSocketGateway()
export class LobbyEvents
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(@Inject(LobbyService) private lobbyService: LobbyService) {}
  afterInit(server: Server) {
    this.lobbyService.server = server;
  }
  async handleConnection(@ConnectedSocket() client: Socket) {
    client.emit(ServerEvents.connectionResponse, 'Welcome');
  }
  async handleDisconnect(client: AuthenticatedSocket | GuestSocket) {
    if (client.data.user && client.data.lobby) {
      this.lobbyService.removeLobby(client.data.lobby);
      return;
    }
    if (client.data.guest && client.data.lobby) {
      client.data.lobby.removeGuest(client.data.guest);
      return;
    }
  }

  @UseGuards(SocketAuthGuard)
  @SubscribeMessage(ClientEvents.authentication)
  @UseFilters(AttachEventName(ClientEvents.authentication))
  async authenticate(@ConnectedSocket() client: AuthenticatedSocket) {
    client.data.user = (client.handshake as any).user as User;
    client.emit(ServerEvents.authenticationResponse, 'Authenticated');
  }

  @SubscribeMessage(ClientEvents.createLobby)
  @UseFilters(AttachEventName(ClientEvents.createLobby))
  async createLobby(@ConnectedSocket() client: AuthenticatedSocket) {
    const lobby = await this.lobbyService.createLobby(client);
    return client.emit(ServerEvents.createLobbyResponse, { pin: lobby.pin });
  }

  @SubscribeMessage(ClientEvents.joinLobby)
  @UseFilters(AttachEventName(ClientEvents.joinLobby))
  async joinLobby(
    @ConnectedSocket() client: Socket,
    @MessageBody() guestDto: NewGuestDto,
  ) {
    const { name, pin } = guestDto;
    const guest = new Guest(client.id, name, client);
    await this.lobbyService.joinLobby(guest, pin);
  }

  @SubscribeMessage(ClientEvents.menuStatus)
  @UseFilters(AttachEventName(ClientEvents.menuStatus))
  async sendMenuStatus(
    @ConnectedSocket() client: AuthenticatedSocket | GuestSocket,
    @MessageBody() data: { menu: any },
  ) {
    if (!client.data.lobby) {
      throw new WsException('You are not connected to a lobby');
    }
    client.data.lobby.sendEvent(ServerEvents.menuStatusResponse, data.menu);
  }

  @SubscribeMessage(ClientEvents.loadBox)
  @UseFilters(AttachEventName(ClientEvents.loadBox))
  async selectBox(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() boxId: number,
  ) {
    await this.lobbyService.loadBox(client.data.lobby, boxId);
    client.emit(ServerEvents.loadBoxResponse, 'Box selected');
  }

  @SubscribeMessage(ClientEvents.startGame)
  @UseFilters(AttachEventName(ClientEvents.startGame))
  async startGame(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() gameName: string,
  ) {
    if (
      client.data.user ||
      client.data?.lobby.lobbyAdmin?.id === client.data?.guest?.id
    ) {
      const minPlayerLimit = 2;
      const errorMessage = 'Not enough players';
      if (client.data.lobby.guests.size < minPlayerLimit)
        throw new WsException(errorMessage);

      await client.data.lobby.startGame(gameName);
      client.emit(ServerEvents.startGameResponse, `${gameName} has started`);
      return;
    }
    throw new WsException('Not authorized');
  }

  @SubscribeMessage(ClientEvents.setLobbyAdmin)
  @UseFilters(AttachEventName(ClientEvents.setLobbyAdmin))
  async setLobbyAdmin(
    @ConnectedSocket() client: AuthenticatedSocket | GuestSocket,
    @MessageBody() guestId: string,
  ) {
    if (
      client.data.user ||
      client.data.lobby.lobbyAdmin?.id === client.data.guest?.id
    ) {
      client.data.lobby.setLobbyAdmin(guestId);
      client.emit(ServerEvents.setLobbyAdminResponse);
      return;
    }
    throw new WsException('Not authorized');
  }

  @SubscribeMessage(ClientEvents.endGame)
  @UseFilters(AttachEventName(ClientEvents.endGame))
  async endGame(@ConnectedSocket() client: AuthenticatedSocket | GuestSocket) {
    if (
      client.data.user ||
      client.data.lobby.lobbyAdmin?.id === client.data.guest?.id
    ) {
      client.data.lobby.endGame();
      return;
    }
    throw new WsException('Not authorized');
  }
}
