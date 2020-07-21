import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';

import { environment } from '../../environments/environment';
import { Command } from '../models/Command';
import { Info } from '../models/Info';

const SERVER_URL = environment.socketUrl;

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket;

  constructor() {
    this.socket = io(SERVER_URL);
  }

  joinRoom(roomId: string) {
    this.socket.emit('joinRoom', roomId);
  }

  sendCommand(roomId: string, command: Command) {
    this.socket.emit('sendCommand', roomId, command);
  }

  sendInfo(roomId: string, info: Info) {
    this.socket.emit('sendInfo', roomId, info);
  }

  getInfo(roomId: string): Observable<Info> {
    this.socket.emit('getInfo', roomId);
    return new Observable<Info>((observer) => {
      this.socket.on('info', (data: Info) => {
        observer.next(data);
      });
    });
  }

  onGetInfo(): Observable<Info> {
    return new Observable<Info>((observer) => {
      this.socket.on('getInfo', () => {
        observer.next();
      });
    });
  }

  onCommand(): Observable<Command> {
    return new Observable<Command>((observer) => {
      this.socket.on('command', (data: Command) => {
        observer.next(data);
      });
    });
  }
}
