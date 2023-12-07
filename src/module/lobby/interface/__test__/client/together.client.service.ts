import { Socket } from 'socket.io-client';

import { NewGuestDto } from '@/module/lobby/application/dto/new-guest.dto';
import { ClientEvents } from '@/module/lobby/application/events/client.events';
import { ServerEvents } from '@/module/lobby/application/events/server.events';

export const createLobby = async (client: Socket) =>
  new Promise<{ pin: string }>((resolve, reject) => {
    client.emit(ClientEvents.createLobby);
    client.on(ServerEvents.createLobbyResponse, (response) => {
      resolve(response);
    });
    client.on(ServerEvents.exception, (error) => {
      if (error.event === ClientEvents.createLobby) {
        reject(error);
      }
    });
  });
export const joinLobby = async (client: Socket, guestDto: NewGuestDto) =>
  new Promise<string>((resolve, reject) => {
    client.emit(ClientEvents.joinLobby, guestDto);
    client.on(ServerEvents.clientNotification, (message) => {
      resolve(message);
    });
    client.on(ServerEvents.exception, (error) => {
      if (error.event === ClientEvents.joinLobby) {
        reject(error);
      }
    });
  });
export const loadBox = async (client: Socket, boxId: number) =>
  new Promise<string>((resolve, reject) => {
    client.emit(ClientEvents.loadBox, boxId);
    client.on(ServerEvents.loadBoxResponse, (message) => {
      resolve(message);
    });
    client.on(ServerEvents.exception, (error) => {
      if (error.event === ClientEvents.loadBox) {
        reject(error);
      }
    });
  });

export const startGame = async (client: Socket, gameName: string) =>
  new Promise<string>((resolve, reject) => {
    client.emit(ClientEvents.startGame, gameName);
    client.on(ServerEvents.startGameResponse, (message) => {
      resolve(message);
    });
    client.on(ServerEvents.exception, (error) => {
      if (error.event === ClientEvents.startGame) {
        reject(error);
      }
    });
  });

export const sendInput = (client: Socket, payload: any) => {
  client.emit(ClientEvents.inputEvent, payload);
};

export const authenticate = async (client: Socket) =>
  new Promise<string>((resolve, reject) => {
    client.emit(ClientEvents.authentication);
    client.on(ServerEvents.authenticationResponse, (message) => {
      resolve(message);
    });
    client.on(ServerEvents.exception, (error) => {
      if (error.event === ClientEvents.authentication) {
        reject(error);
      }
    });
  });
export const setLobbyAdmin = async (client: Socket, guestClientId: string) =>
  new Promise<string>((resolve, reject) => {
    client.emit(ClientEvents.setLobbyAdmin, guestClientId);
    client.on(ServerEvents.setLobbyAdminResponse, (message) => {
      resolve(message);
    });
    client.on(ServerEvents.exception, (error) => {
      if (error.event === ClientEvents.setLobbyAdmin) {
        reject(error);
      }
    });
  });

export const sendMenuStatus = async (
  client: Socket,
  menuStatus: { menu: any },
) =>
  new Promise<any>((resolve, reject) => {
    client.emit(ClientEvents.menuStatus, menuStatus);
    client?.on(ServerEvents.exception, (error) => {
      if (error.event === ClientEvents.menuStatus) reject(error);
    });
    client.on(ServerEvents.menuStatusResponse, (message) => {
      resolve(message);
    });
  });

export const endGame = (client: Socket): Promise<string> =>
  new Promise<string>((resolve, reject) => {
    client?.emit(ClientEvents.endGame);
    client?.on(ServerEvents.exception, (error) => {
      if (error.event === ClientEvents.endGame) reject(error);
    });
    client?.on(ServerEvents.gameEvent, (gameEvent) => {
      if (gameEvent.event === ServerEvents.endGameResponse) {
        resolve(gameEvent);
      }
    });
  });
